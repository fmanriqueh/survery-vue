import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios'

const ApiService = {
    init(){
        Vue.use(VueAxios, axios);
        Vue.axios.defaults.baseURL = "http://localhost:8000/api";
    },
    get(resource, slug=""){
        return Vue.axios.get(`${resource}/${slug}`).catch( (error) => {
            console.log(error);
        });
    },
    post(resource, params){
        return Vue.axios.post(`${resource}`, params)
        .catch( (error) => {
            console.log(error);        
        });
    }

}

export default ApiService;