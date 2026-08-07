<template>
    <main :class="$style.page">
        <a-card>
            <section :class="$style.hero">
                <a-space direction="vertical" :size="12">
                    <a-tag>Boring AI Platform</a-tag>
                    <a-typography-title :level="2">开始构建你的 AI 工作台</a-typography-title>
                    <a-typography-paragraph type="secondary">
                        这里是首页占位，用于承载项目概览、最近任务、快捷入口和系统状态。
                    </a-typography-paragraph>
                </a-space>
                <a-space>
                    <a-button type="primary">新建工作流</a-button>
                    <a-button>查看文档</a-button>
                </a-space>
            </section>
        </a-card>

        <a-row :class="$style.row" :gutter="[16, 16]">
            <a-col :lg="6" :md="12" :xs="24">
                <a-card :class="$style.card"><a-statistic title="工作流" :value="18" /></a-card>
            </a-col>
            <a-col :lg="6" :md="12" :xs="24">
                <a-card :class="$style.card"><a-statistic title="知识库" :value="6" /></a-card>
            </a-col>
            <a-col :lg="6" :md="12" :xs="24">
                <a-card :class="$style.card"><a-statistic title="今日调用" :value="1260" /></a-card>
            </a-col>
            <a-col :lg="6" :md="12" :xs="24">
                <a-card :class="$style.card">
                    <a-statistic title="成功率" suffix="%" :value="98.6" />
                </a-card>
            </a-col>
        </a-row>

        <a-row :class="$style.row" :gutter="[16, 16]">
            <a-col :lg="14" :xs="24">
                <a-card :class="$style.card" title="快捷入口">
                    <div :class="$style.actions">
                        <a-button block>创建聊天助手</a-button>
                        <a-button block>上传知识文档</a-button>
                        <a-button block>配置模型服务</a-button>
                        <a-button block>邀请团队成员</a-button>
                    </div>
                </a-card>
            </a-col>
            <a-col :lg="10" :xs="24">
                <a-card :class="$style.card" title="最近动态">
                    <a-timeline>
                        <a-timeline-item>内容生成流程运行完成</a-timeline-item>
                        <a-timeline-item>知识库同步任务已创建</a-timeline-item>
                        <a-timeline-item>模型配置已更新</a-timeline-item>
                    </a-timeline>
                </a-card>
            </a-col>
        </a-row>
    </main>
</template>

<style module>
.page {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
    min-width: 0;
    overflow: auto;
    width: 100%;
}

.hero {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    justify-content: space-between;
    min-width: 0;
    width: 100%;
}

.hero h2,
.hero p {
    margin: 0;
}

.actions {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.row {
    flex: 0 0 auto;
    width: 100%;
}

.card {
    height: 100%;
}

@media (max-width: 768px) {
    .hero {
        align-items: flex-start;
        flex-direction: column;
        gap: 16px;
    }

    .actions {
        grid-template-columns: 1fr;
    }
}
</style>
