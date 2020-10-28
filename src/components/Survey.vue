<template>
  <v-container>
    <v-row class="text-center">
      <v-col  md="6" sm="8" xs="5" class="mx-auto">       
        <v-form
        @submit.prevent="onSubmit"
        ref="form"
        >
          <v-text-field
          v-model="client.name"
          :error-messages="nameErrors"
          label="Nombre"
          required
          @input="$v.client.name.$touch()"
          @blur="$v.client.name.$touch()"
          >
          </v-text-field>
            
          <v-select
          v-model="client.document_type"
          :error-messages="document_typeErrors"
          label="Tipo de documento"
          :items="document_types"
          required
          @input="$v.client.document_type.$touch()"
          @blur="$v.client.document_type.$touch()"
          >

          </v-select>
          <v-text-field
          v-model="client.document"
          :error-messages="documentErrors"
          label="Documento"
          required
          @input="$v.client.document.$touch()"
          @blur="$v.client.document.$touch()"
          >
            
          </v-text-field>
          <v-text-field
          v-model="client.temperature"
          :error-messages="temperatureErrors"
          label="Temperatura"
          suffix="°C"
          required
          type = "number"
          @input="$v.client.temperature.$touch()"
          @blur="$v.client.temperature.$touch()"
          >
            
          </v-text-field>
          <v-checkbox
            v-model="client.symptoms"  
            label="¿Síntomas de coronavirus?"
          ></v-checkbox>

          <v-select
          v-model="client.store"
          :error-messages="storeErrors"
          label="Almacén"
          :items="stores"
          required  
          @input="$v.client.store.$touch()"
          @blur="$v.client.store.$touch()"
          >

          </v-select>
          <v-btn
            class="mr-4"
            :disabled="loading"
            @click="clear"
          >
            Limpiar
          </v-btn>

          <v-btn
          type="submit"
          :disabled="loading"

          >
            Guardar
          </v-btn>
        </v-form>
        <br>
        <div>
          <v-alert
          dense
          text
          type="warning"
          v-if="careful"
          >
            Tomar medidas.
          </v-alert>
          <v-alert
          dense
          text
          type="success"
          v-if="success"
          >
            Registro exitoso.
          </v-alert>
          <v-alert
          dense
          text
          type="error"
          v-if="error"
          >
            No se pudo guardar el registro.
          </v-alert>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, between } from 'vuelidate/lib/validators'
  import ApiService from '@/services/api.service';
  
  export default {
    mixins: [validationMixin],
    
    name: 'Survey',

    data: () => ({
      client:{
        name: '',
        document_type: null,
        document: null,
        temperature: null,
        store: null,
        symptoms: false,
      },
      name : '',
      stores: ['STARA CALLE 12','STARA CALLE 11','STARA CALLE 10','STARA CALLE 8VA','STARA VENTURA','ZARETH VENTURA','STARA SINGAPUR','STARA VENAVER','STARA MEGACENTRO','STARA MAYORCA'],
      document_types : ['CEDULA DE CUIDADANIA','CEDULA DE EXTRANJERÍA'],
      loading: false,
      success: false,
      careful: false,
      error: false,
    }),
    validations: {
      client: {
        name: {
          required, 
          maxLength: maxLength(150)
        },
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
      }
    },
    computed: {
      nameErrors () {
        const errors = []
        if (!this.$v.client.name.$dirty) return errors
        !this.$v.client.name.maxLength && errors.push('El nombre no puede superar los 150 caracteres')
        !this.$v.client.name.required && errors.push('El campo nombre es obligatorio.')
        return errors
      },
      document_typeErrors () {
        const errors = []
        if (!this.$v.client.document_type.$dirty) return errors
        !this.$v.client.document_type.required && errors.push('El tipo de documento es obligatorio')
        return errors
      },
      documentErrors () {
        const errors = []
        if (!this.$v.client.document.$dirty) return errors
        !this.$v.client.document.between && errors.push('Número de documento inválido')
        !this.$v.client.document.required && errors.push('El campo documento es obligatorio.')
        return errors
      },
      temperatureErrors () {
        const errors = []
        if (!this.$v.client.temperature.$dirty) return errors
        !this.$v.client.temperature.between && errors.push('Temperatura inválida')
        !this.$v.client.temperature.required && errors.push('El campo temperatura es obligatorio.')
        return errors
      },
      storeErrors () {
        const errors = []
        if (!this.$v.client.store.$dirty) return errors
        !this.$v.client.store.required && errors.push('El almacén es obligatorio')
        return errors
      },
    },
    methods: {
      clear(){
        this.$refs.form.reset();
        this.$v.$reset();
        this.careful = false;
        this.success = false;
      },

      onSubmit: async function(){
        this.$v.$touch()
        if (this.$v.$pending || this.$v.$error) return;
        
        this.loading = true; 
        this.careful = false;
        this.success = false;

        if(this.client.symptoms == null)
          this.client.symptoms = false;

        if(this.client.temperature <= 36 || this.client.temperature >= 38 || this.client.symptoms){
          this.careful = true;
        }

        let response = await ApiService.post('client', this.client );
        this.loading = false;
        if(response == undefined){
          this.error = true;
        }else{
          this.$refs.form.reset();
          this.$v.$reset();
          this.loading = false;
          this.success = true;
        }
        
      }
    }
  }
</script>