<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="6" class="mx-auto">       
        <v-form
        @submit.prevent="onSubmit"
        lazy-validation
        ref="form"
        >
          <v-text-field
          v-model="name"
          :error-messages="nameErrors"
          label="Nombre"
          required
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
          >
            
          </v-text-field>
          <v-select
          v-model="document_type"
          :error-messages="document_typeErrors"
          label="Tipo de documento"
          :items="document_types"
          required
          @input="$v.document_type.$touch()"
          @blur="$v.document_type.$touch()"
          >

          </v-select>
          <v-text-field
          v-model="document"
          :error-messages="documentErrors"
          label="Documento"
          required
          @input="$v.document.$touch()"
          @blur="$v.document.$touch()"
          >
            
          </v-text-field>
          <v-text-field
          v-model="temperature"
          :error-messages="temperatureErrors"
          label="Temperatura"
          suffix="°C"
          required
          @input="$v.temperature.$touch()"
          @blur="$v.temperature.$touch()"
          >
            
          </v-text-field>
          <v-checkbox
            v-model="symptoms"
            label="¿Síntomas de coronavirus?"
          ></v-checkbox>

          <v-select
          v-model="store"
          :error-messages="storeErrors"
          label="Almacen"
          :items="stores"
          required  
          @input="$v.store.$touch()"
          @blur="$v.store.$touch()"
          >

          </v-select>
          <v-btn
            class="mr-4"
            @click="clear"
          >
            Limpiar
          </v-btn>

          <v-btn
          type="submit"
          >
            Guardar
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, between } from 'vuelidate/lib/validators'
  
  export default {
    mixins: [validationMixin],
    
    name: 'Survey',

    data: () => ({
      name:'',
      document_type:'',
      document:'',
      temperature:'',
      store:'',
      symptoms:false,
      menu: false,
      stores: ['STARA CALLE 12','STARA CALLE 11','STARA CALLE 10','STARA CALLE 8VA','STARA VENTURA','ZARETH VENTURA','STARA SINGAPUR','STARA VENAVER','STARA MEGACENTRO','STARA MAYORCA'],
      document_types : ['CEDULA DE CUIDADANIA','CEDULA DE EXTRANJERÍA','PASAPORTE']
    }),
    validations: {
      name: {required, maxLength: maxLength(150)},
      document_type: {
        required
      },
      document: {
        required,
        between : between(1, 1999999999)
      },
      temperature: {
        required,
        between: between(1,99)
      },
      store:{
        required
      }
    },
    computed: {
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.maxLength && errors.push('Name must be at most 150 characters long')
        !this.$v.name.required && errors.push('Name is required.')
        return errors
      },
      document_typeErrors () {
        const errors = []
        if (!this.$v.document_type.$dirty) return errors
        !this.$v.document_type.required && errors.push('Document type is required')
        return errors
      },
      documentErrors () {
        const errors = []
        if (!this.$v.document.$dirty) return errors
        !this.$v.document.between && errors.push('Invalid document')
        !this.$v.document.required && errors.push('Document is required.')
        return errors
      },
      temperatureErrors () {
        const errors = []
        if (!this.$v.temperature.$dirty) return errors
        !this.$v.temperature.between && errors.push('Invalid temperature')
        !this.$v.temperature.required && errors.push('Temperature is required.')
        return errors
      },
      storeErrors () {
        const errors = []
        if (!this.$v.store.$dirty) return errors
        !this.$v.store.required && errors.push('Store is required')
        return errors
      },
    },
    methods: {
      clear(){
        this.$refs.form.reset()
        this.$v.$reset()
      },
      onSubmit: function(){
        this.$v.$touch()
        
        if (this.$v.$pending || this.$v.$error) return;

        const URI = "http://localhost:8000/api/client"
        this.$http.post(URI, {
          name:this.name,
          document_type:this.document_type,
          document:this.document,
          temperature:this.temperature,
          store:this.store,
          symptoms:this.symptoms? 1:0,
        }).then(() => {
          this.$refs.form.reset()
          this.$v.$reset()
        })
        .catch((error) => {
          console.error(error)
        })

        // this.axios.get(URI, this.data, {
        //   headers: {

        //   }
        // }).then((res)=>{
        //   console.log(res);
        // })
      }
    }
  }
</script>