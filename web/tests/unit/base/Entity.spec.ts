import { shallowMount } from '@vue/test-utils';
import { ref, reactive, toRefs } from 'vue';
// import Entity from '@/base/Entity';
import Entity from '@/base/Entity';

// import HelloWorld from '@/components/HelloWorld.vue';

// describe('HelloWorld.vue', () => {
//     it('renders props.msg when passed', () => {
//         const msg = 'new message';
//         const wrapper = shallowMount(HelloWorld, {
//             props: { msg },
//         });
//         expect(wrapper.text()).toMatch(msg);
//     });
// });

describe('Entity', () => {
    it('set', () => {
        const domain = new Entity({
            config: {
                a: '',
            },
        });
        domain.watch((state, old, key) => {
            expect(key).toEqual('config');
            expect(state[key]).not.toEqual(old[key]);
            temp = state && state.config.a;
        });
        let temp = {
            a: '',
        };
        domain.state.config = { a: 'hello' };
        // console.log('state', domain.state);
        expect(temp).toEqual('hello');
    });

    it('watch', () => {
        const domain = new Entity({
            hello: 'word',
        });
        const stop = domain.watch(() => {
            expect(true).toEqual(false);
        });
        domain.state.hello = 'word';
        stop();
        domain.state.hello = 'word2';
    });

    it('reactive', () => {
        const reactiveObj = reactive({
            hello: 'word',
        });
        const domain = new Entity(reactiveObj);
        domain.watch((state, old, key) => {
            expect(key).toEqual('hello2');
            console.log(state, reactiveObj, old);
            expect(state).toEqual(reactiveObj);
            expect(state[key]).not.toEqual(old[key]);
            state.hello2 = 'new';
            expect(state[key]).not.toEqual(domain.state[key]);
        });

        domain.state.hello2 = 'word2';
        // console.log('domain.state', domain.state, toRefs(domain.state));
        // console.log(reactiveObj, toRefs(reactiveObj));
        expect(domain.state).toEqual(reactiveObj);
        expect(toRefs(domain.state)).toEqual(toRefs(reactiveObj));
    });
});
