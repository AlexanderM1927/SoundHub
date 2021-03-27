import { IonButton, loadingController } from '@ionic/vue';
export const functions = {
  components: { IonButton },
  data () {
    return {
      loading: {}
    }
  },
  methods: {
    validateForm (array, fun) {
      let isComplete = true
      for (let i = 0; i < array.length; i++) {
        if (array[i] === undefined || array[i] === null || array[i] === '') isComplete = false
      }
      if (!isComplete) {
        this.alert('warning', 'Faltan campos por rellenar')
      } else {
        fun()
      }
      return isComplete
    },
    alert (type, msg) {
      this.$q.notify({
        position: 'top',
        message: msg,
        color: type
      })
    },
    async activateLoading () {
      const loading = await loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
        // duration: this.timeout,
      });
      this.loading = loading
      await loading.present();
    },
    async disableLoading () {
      await this.loading.dismiss();
    }
  }
}
