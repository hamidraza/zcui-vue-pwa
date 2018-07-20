import { mount } from '@vue/test-utils'
import HomePage from './home.vue';

describe('HomePage', () => {
  let cmp;

  beforeEach(() => {
    cmp = mount(HomePage, {
      propsData: {}
    });
  });

  it('has welcome message', () => {
    expect(cmp.vm.welcomeMsg).toBe('ZcUI');
  });

});

