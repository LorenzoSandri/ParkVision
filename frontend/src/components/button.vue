<template>
    <button @click.stop="$emit('click')">
        <slot/>
    </button>
</template>

<script setup>
</script>