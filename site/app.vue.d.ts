/// <reference path="shims-vue.d.ts" />
import { Ref } from 'vue';
declare const _default: import("vue").DefineComponent<{}, {
    showTabs: Ref<boolean>;
    routes: ({
        path: string;
        name: string;
        component: () => Promise<typeof import("*.vue")>;
        redirect?: undefined;
    } | {
        path: string;
        redirect: string;
        name?: undefined;
        component?: undefined;
    })[];
    index: Ref<number | null>;
    name: import("vue").ComputedRef<string | false | undefined>;
    path: import("vue").ComputedRef<string | false>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, import("vue").EmitsOptions, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{} & {}>, {}>;
export default _default;
