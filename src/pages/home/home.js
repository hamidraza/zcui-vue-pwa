/* @flow */
import welcome from '~/components/zc-welcome';

export default {
  name: 'page-home',
  components: {
    welcome
  },
  data() {
    return {
      welcomeMsg: 'ZcUI',
    };
  },
}

