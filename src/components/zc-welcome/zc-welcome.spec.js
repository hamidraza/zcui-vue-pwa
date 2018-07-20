import { mount } from '@vue/test-utils'
import ZcWelcome from './zc-welcome.vue';

describe('ZcWelcome', () => {
  let cmp;

  beforeEach(() => {
    cmp = mount(ZcWelcome, {
      propsData: {}
    });
  });

  it('has welcome message', () => {
    expect(cmp.vm.message).toBe('Welcome!');
  });

});

