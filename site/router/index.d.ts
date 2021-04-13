/// <reference path="../shims-vue.d.ts" />
export declare const routes: ({
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
export declare const router: import("vue-router").Router;
