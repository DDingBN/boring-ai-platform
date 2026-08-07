<template>
    <main :class="$style.page">
        <a-card :class="$style.card">
            <a-typography-title :level="3">Boring AI Platform</a-typography-title>
            <a-form layout="vertical">
                <a-form-item label="账号" name="username">
                    <a-input placeholder="请输入账号" />
                </a-form-item>
                <a-form-item label="密码" name="password">
                    <a-input-password placeholder="请输入密码" />
                </a-form-item>
                <a-button block html-type="submit" type="primary">登录</a-button>
            </a-form>
        </a-card>
    </main>
</template>

<style module>
.page {
    align-items: center;
    display: flex;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
}

.card {
    width: min(100%, 420px);
}
</style>
