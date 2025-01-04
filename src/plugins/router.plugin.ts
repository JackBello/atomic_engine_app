import { createWebHashHistory, createRouter } from "vue-router";

import routerConfig from "@/configs/router.config";
import { isOpenProject, loadOpenProject } from "@/domain/utils/router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: routerConfig,
})

router.beforeEach(async (to, _, next) => {
    const layout = to.meta.layout

    await loadOpenProject()

    if (layout === "engine" && !isOpenProject()) {
        next({ name: 'dashboard.index' })
    } else if (layout === "dashboard" && isOpenProject()) {
        next({ name: 'engine.index' })
    } else {
        next()
    }
})

export default router