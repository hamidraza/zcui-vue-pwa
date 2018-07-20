import { shallowMount } from '@vue/test-utils'
import App from './app.vue';

describe('App', () => {
  let cmp;

  beforeEach(() => {
    cmp = shallowMount(App, {
      propsData: {},
      stubs: ['router-link', 'router-view'],
    });
  });

  it('has welcome message', () => {
    expect(cmp.html()).toContain('<router-view-stub></router-view-stub>');
  });

});

