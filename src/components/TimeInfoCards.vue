<template>
	<div class="info-section">
		<div class="info-card" data-card="start">
			<div class="card-icon">🌅</div>
			<div class="label">출근 시간</div>
			<div class="value">{{ startTime }}</div>
		</div>

		<div class="info-card" data-card="current">
			<div class="card-icon">⏰</div>
			<div class="label">현재 시간</div>
			<div class="value">{{ currentTime }}</div>
		</div>

		<div class="info-card highlight-card" data-card="end">
			<div class="card-icon">🌇</div>
			<div class="label">퇴근 시간</div>
			<div class="value highlight">{{ endTime }}</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	startTime: {
		type: String,
		required: true,
	},
	currentTime: {
		type: String,
		required: true,
	},
	endTime: {
		type: String,
		required: true,
	},
})
</script>

<style scoped>
.info-section {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
	gap: 1rem;
	margin-bottom: 1.5rem;
	flex-shrink: 0;
}

.info-card {
	background: var(
		--theme-card-bg,
		linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)
	);
	padding: 1.5rem 1rem;
	border-radius: 20px;
	text-align: center;
	border: 1px solid rgba(0, 0, 0, 0.05);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	overflow: hidden;
}

.info-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 4px;
	background: linear-gradient(
		90deg,
		var(--theme-primary, #667eea) 0%,
		var(--theme-secondary, #764ba2) 100%
	);
	transform: scaleX(0);
	transition: transform 0.3s ease;
}

.info-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.info-card:hover::before {
	transform: scaleX(1);
}

.highlight-card {
	background: var(
		--theme-highlight-card-bg,
		linear-gradient(
			135deg,
			rgba(102, 126, 234, 0.08) 0%,
			rgba(118, 75, 162, 0.08) 100%
		)
	);
	border: 2px solid rgba(102, 126, 234, 0.2);
	transition: background 0.3s ease;
}

.highlight-card::before {
	transform: scaleX(1);
	background: linear-gradient(
		90deg,
		var(--theme-primary, #667eea) 0%,
		var(--theme-secondary, #764ba2) 100%
	);
}

.card-icon {
	font-size: 1.5rem;
	margin-bottom: 0.5rem;
	display: block;
	animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-5px);
	}
}

.info-card .label {
	font-size: 0.75rem;
	color: var(--theme-text-secondary, #6b7280);
	margin-bottom: 0.5rem;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	transition: color 0.3s ease;
}

.info-card .value {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--theme-text, #1a1a2e);
	letter-spacing: -0.02em;
	transition: color 0.3s ease;
}

.info-card .value.highlight {
	color: var(--theme-primary, #667eea);
	font-size: 1.75rem;
	background: linear-gradient(
		135deg,
		var(--theme-primary, #667eea) 0%,
		var(--theme-secondary, #764ba2) 100%
	);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

@media (max-width: 768px) {
	.info-section {
		grid-template-columns: 1fr;
		gap: 1rem;
	}
}
</style>
