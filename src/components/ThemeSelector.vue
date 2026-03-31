<template>
	<div class="theme-selector" :class="{ dark: currentTheme === 'dark' }">
		<button
			class="theme-button"
			@click="isOpen = !isOpen"
			:aria-label="`테마 선택: ${themes[currentTheme]?.name}`"
		>
			<span class="theme-icon">{{ themes[currentTheme]?.icon || '🎨' }}</span>
			<span class="theme-name">{{ themes[currentTheme]?.name || '기본' }}</span>
			<span class="theme-arrow" :class="{ open: isOpen }">▼</span>
		</button>

		<Transition name="dropdown">
			<div v-if="isOpen" class="theme-dropdown">
				<button
					v-for="(theme, key) in themes"
					:key="key"
					class="theme-option"
					:class="{ active: currentTheme === key }"
					@click="setTheme(key)"
				>
					<span class="theme-option-icon">{{ theme.icon }}</span>
					<span class="theme-option-name">{{ theme.name }}</span>
					<span v-if="currentTheme === key" class="theme-check">✓</span>
				</button>
			</div>
		</Transition>
	</div>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'

const { currentTheme, themes, setTheme, isOpen } = useTheme()
</script>

<style scoped>
.theme-selector {
	position: absolute;
	right: 2rem;
	z-index: 100;
}

.theme-button {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(10px);
	border: 2px solid rgba(102, 126, 234, 0.2);
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--theme-text, #1a1a2e);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-button:hover {
	background: rgba(255, 255, 255, 1);
	border-color: var(--theme-primary, #667eea);
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-selector.dark .theme-button,
.theme-selector.dark .theme-dropdown {
	background: var(--theme-background);
	border-color: var(--theme-primary);
}

.theme-icon {
	font-size: 1.25rem;
}

.theme-name {
	flex: 1;
	text-align: left;
}

.theme-arrow {
	transition: transform 0.3s ease;
	font-size: 0.75rem;
}

.theme-arrow.open {
	transform: rotate(180deg);
}

.theme-dropdown {
	position: absolute;
	top: calc(100% + 0.5rem);
	right: 0;
	background: rgba(255, 255, 255, 0.98);
	backdrop-filter: blur(20px);
	border-radius: 16px;
	padding: 0.5rem;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2),
		0 0 0 1px rgba(255, 255, 255, 0.5) inset;
	min-width: 180px;
	overflow: hidden;
}

.theme-option {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	width: 100%;
	padding: 0.75rem 1rem;
	border: none;
	background: transparent;
	border-radius: 12px;
	cursor: pointer;
	transition: all 0.2s ease;
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--theme-text, #1a1a2e);
	text-align: left;
}

.theme-option:hover {
	background: rgba(102, 126, 234, 0.1);
}

.theme-option.active {
	background: linear-gradient(
		135deg,
		var(--theme-primary, #667eea) 0%,
		var(--theme-secondary, #764ba2) 100%
	);
	color: white;
}

.theme-option-icon {
	font-size: 1.25rem;
}

.theme-option-name {
	flex: 1;
}

.theme-check {
	font-size: 1rem;
	font-weight: bold;
}

/* 드롭다운 애니메이션 */
.dropdown-enter-active,
.dropdown-leave-active {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from {
	opacity: 0;
	transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
	opacity: 0;
	transform: translateY(-10px) scale(0.95);
}

@media (max-width: 768px) {
	.theme-button {
		padding: 0.5rem 0.75rem;
		font-size: 0.8125rem;
	}

	.theme-name {
		display: none;
	}

	.theme-dropdown {
		right: auto;
		left: 0;
		min-width: 160px;
	}
}
</style>
