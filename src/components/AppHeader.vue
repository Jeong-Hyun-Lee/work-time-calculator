<template>
	<header class="app-header">
		<div class="app-header-inner">
			<span class="app-header-icon">
				<ClockIcon />
			</span>
			<h1>{{ $t('app.title') }}</h1>
			<p class="subtitle">{{ $t('app.subtitle') }}</p>
			<select
				class="locale-select"
				:value="locale"
				:aria-label="$t('app.language')"
				@change="setLocale($event.target.value)"
			>
				<option v-for="code in SUPPORTED_LOCALES" :key="code" :value="code">
					{{ LOCALE_LABELS[code] }}
				</option>
			</select>
		</div>
	</header>
</template>

<script setup>
import ClockIcon from './icons/ClockIcon.vue'
import {
	locale,
	setLocale,
	SUPPORTED_LOCALES,
	LOCALE_LABELS,
} from '../i18n'
</script>

<style scoped>
.app-header {
	max-width: 1280px;
	margin: 0 auto;
	padding: var(--spacing-24) var(--spacing-16) var(--spacing-16);
}

.app-header-inner {
	display: flex;
	align-items: center;
	gap: var(--spacing-8);
	border-bottom: 1px solid rgba(255, 255, 255, 0.25);
	padding-bottom: var(--spacing-12);
}

.app-header-icon {
	display: flex;
	width: 22px;
	height: 22px;
	color: #ffffff;
	flex-shrink: 0;
	animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
	0%,
	100% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.12);
		opacity: 0.85;
	}
}

.app-header-icon :deep(svg) {
	width: 100%;
	height: 100%;
}

h1 {
	font-size: var(--text-subheading);
	font-weight: 600;
	letter-spacing: -0.02em;
	color: #ffffff;
}

.subtitle {
	margin-left: auto;
	font-size: var(--text-caption);
	color: rgba(255, 255, 255, 0.8);
}

.locale-select {
	flex-shrink: 0;
	padding: var(--spacing-4) var(--spacing-8);
	border: 1px solid rgba(255, 255, 255, 0.35);
	border-radius: var(--radius-control);
	background: rgba(255, 255, 255, 0.12);
	color: #ffffff;
	font-family: var(--font-sans);
	font-size: var(--text-caption);
	cursor: pointer;
}

.locale-select:hover {
	background: rgba(255, 255, 255, 0.2);
}

.locale-select:focus-visible {
	outline: 2px solid #ffffff;
	outline-offset: 2px;
}

/* 드롭다운 목록은 브라우저가 그리므로 페이지 배경을 못 씀 */
.locale-select option {
	color: var(--color-ink);
	background: #ffffff;
}

@media (max-width: 600px) {
	.subtitle {
		display: none;
	}

	.locale-select {
		margin-left: auto;
	}
}
</style>
