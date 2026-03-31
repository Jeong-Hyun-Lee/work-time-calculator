import { ref, watch, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'

// 테마 정의
export const themes = {
		default: {
		name: '기본',
		icon: '🎨',
		colors: {
			primary: '#667eea',
			secondary: '#764ba2',
			accent: '#f093fb',
			background:
				'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
			containerBg: 'rgba(255, 255, 255, 0.95)',
			text: '#1a1a2e',
			textSecondary: '#6b7280',
			cardBg: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
			countdown: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			warning: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
			urgent: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
			overdue: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
			highlightCardBg:
				'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
			inputBg: '#f9fafb',
			inputBgHover: '#ffffff',
			inputBgFocus: '#ffffff',
		},
	},
	dark: {
		name: '다크',
		icon: '🌙',
		colors: {
			primary: '#4f46e5',
			secondary: '#7c3aed',
			accent: '#a855f7',
			background:
				'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #581c87 100%)',
			containerBg: 'rgba(30, 27, 75, 0.95)',
			text: '#f3f4f6',
			textSecondary: '#9ca3af',
			cardBg: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
			countdown: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
			warning: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
			urgent: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
			overdue: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
			highlightCardBg:
				'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)',
			inputBg: 'rgba(30, 27, 75, 0.6)',
			inputBgHover: 'rgba(30, 27, 75, 0.8)',
			inputBgFocus: 'rgba(30, 27, 75, 0.9)',
		},
	},
	ocean: {
		name: '오션',
		icon: '🌊',
		colors: {
			primary: '#06b6d4',
			secondary: '#0891b2',
			accent: '#22d3ee',
			background:
				'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)',
			containerBg: 'rgba(255, 255, 255, 0.95)',
			text: '#0c4a6e',
			textSecondary: '#64748b',
			cardBg: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)',
			countdown: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
			warning: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
			urgent: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
			overdue: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
			highlightCardBg:
				'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(8, 145, 178, 0.08) 100%)',
			inputBg: '#f9fafb',
			inputBgHover: '#ffffff',
			inputBgFocus: '#ffffff',
		},
	},
	forest: {
		name: '포레스트',
		icon: '🌲',
		colors: {
			primary: '#10b981',
			secondary: '#059669',
			accent: '#34d399',
			background:
				'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
			containerBg: 'rgba(255, 255, 255, 0.95)',
			text: '#064e3b',
			textSecondary: '#6b7280',
			cardBg: 'linear-gradient(135deg, #d1fae5 0%, #ffffff 100%)',
			countdown: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
			warning: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
			urgent: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
			overdue: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
			highlightCardBg:
				'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)',
			inputBg: '#f9fafb',
			inputBgHover: '#ffffff',
			inputBgFocus: '#ffffff',
		},
	},
	sunset: {
		name: '선셋',
		icon: '🌅',
		colors: {
			primary: '#f97316',
			secondary: '#ea580c',
			accent: '#fb923c',
			background:
				'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)',
			containerBg: 'rgba(255, 255, 255, 0.95)',
			text: '#7c2d12',
			textSecondary: '#78716c',
			cardBg: 'linear-gradient(135deg, #fed7aa 0%, #ffffff 100%)',
			countdown: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
			warning: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
			urgent: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
			overdue: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
			highlightCardBg:
				'linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(234, 88, 12, 0.08) 100%)',
			inputBg: '#f9fafb',
			inputBgHover: '#ffffff',
			inputBgFocus: '#ffffff',
		},
	},
	vegito: {
		name: '베지트',
		icon: '💙',
		colors: {
			primary: '#00bfff',
			secondary: '#00ffff',
			accent: '#87ceeb',
			background:
				'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)',
			containerBg: 'rgba(26, 26, 46, 0.95)',
			text: '#00bfff',
			textSecondary: '#87ceeb',
			cardBg: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
			countdown:
				'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 30%, #0f3460 60%, #1a1a2e 100%)',
			warning:
				'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 30%, #0f3460 50%, #0066ff 70%, #00bfff 100%)',
			urgent:
				'linear-gradient(135deg, #000033 0%, #000066 20%, #0066ff 50%, #00bfff 80%, #00ffff 100%)',
			overdue:
				'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #6a0dad 60%, #9370db 100%)',
			highlightCardBg:
				'linear-gradient(135deg, rgba(0, 191, 255, 0.15) 0%, rgba(0, 255, 255, 0.15) 100%)',
			inputBg: 'rgba(26, 26, 46, 0.6)',
			inputBgHover: 'rgba(26, 26, 46, 0.8)',
			inputBgFocus: 'rgba(26, 26, 46, 0.9)',
		},
	},
	broly: {
		name: '브로리',
		icon: '💚',
		colors: {
			primary: '#7cfc00',
			secondary: '#32cd32',
			accent: '#adff2f',
			background:
				'linear-gradient(135deg, #0a1a0a 0%, #1a2e1a 30%, #0f340f 60%, #1a2e1a 100%)',
			containerBg: 'rgba(26, 46, 26, 0.95)',
			text: '#7cfc00',
			textSecondary: '#adff2f',
			cardBg: 'linear-gradient(135deg, #1f291f 0%, #111811 100%)',
			countdown:
				'linear-gradient(135deg, #0a1a0a 0%, #1a2e1a 30%, #0f340f 60%, #1a2e1a 100%)',
			warning:
				'linear-gradient(135deg, #0a1a0a 0%, #1a2e1a 30%, #0f340f 50%, #228b22 70%, #32cd32 100%)',
			urgent:
				'linear-gradient(135deg, #001a00 0%, #003300 20%, #32cd32 50%, #7cfc00 80%, #ffff00 100%)',
			overdue:
				'linear-gradient(135deg, #1a2e1a 0%, #162e16 30%, #6a8d6a 60%, #93db93 100%)',
			highlightCardBg:
				'linear-gradient(135deg, rgba(124, 252, 0, 0.15) 0%, rgba(50, 205, 50, 0.15) 100%)',
			inputBg: 'rgba(26, 46, 26, 0.6)',
			inputBgHover: 'rgba(26, 46, 26, 0.8)',
			inputBgFocus: 'rgba(26, 46, 26, 0.9)',
		},
	},
}

export function useTheme() {
	const currentTheme = useStorage('theme', 'default')
	const isOpen = ref(false)

	const setTheme = (themeName) => {
		if (themes[themeName]) {
			currentTheme.value = themeName
			applyTheme(themes[themeName])
			isOpen.value = false
		}
	}

	const applyTheme = (theme) => {
		const root = document.documentElement
		const colors = theme.colors

		// CSS 변수 설정
		root.style.setProperty('--theme-primary', colors.primary)
		root.style.setProperty('--theme-secondary', colors.secondary)
		root.style.setProperty('--theme-accent', colors.accent)
		root.style.setProperty('--theme-background', colors.background)
		root.style.setProperty('--theme-container-bg', colors.containerBg)
		root.style.setProperty('--theme-text', colors.text)
		root.style.setProperty('--theme-text-secondary', colors.textSecondary)
		root.style.setProperty('--theme-card-bg', colors.cardBg)
		root.style.setProperty('--theme-countdown', colors.countdown)
		root.style.setProperty('--theme-warning', colors.warning)
		root.style.setProperty('--theme-urgent', colors.urgent)
		root.style.setProperty('--theme-overdue', colors.overdue)
		root.style.setProperty(
			'--theme-highlight-card-bg',
			colors.highlightCardBg ||
				'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)'
		)
		root.style.setProperty('--theme-input-bg', colors.inputBg || '#f9fafb')
		root.style.setProperty('--theme-input-bg-hover', colors.inputBgHover || '#ffffff')
		root.style.setProperty('--theme-input-bg-focus', colors.inputBgFocus || '#ffffff')
	}

	// 테마 변경 감지
	watch(currentTheme, (newTheme) => {
		if (themes[newTheme]) {
			applyTheme(themes[newTheme])
		}
	})

	// 초기 테마 적용
	onMounted(() => {
		if (themes[currentTheme.value]) {
			applyTheme(themes[currentTheme.value])
		}
	})

	return {
		currentTheme,
		themes,
		setTheme,
		isOpen,
	}
}
