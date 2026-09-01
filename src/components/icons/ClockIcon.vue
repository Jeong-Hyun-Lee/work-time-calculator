<template>
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<!-- 시계 외곽 링 -->
		<circle
			cx="12"
			cy="12"
			r="9.75"
			fill="none"
			stroke="currentColor"
			stroke-opacity="0.3"
			stroke-width="0.5"
		/>
		<circle
			cx="12"
			cy="12"
			r="9"
			fill="none"
			stroke="currentColor"
			stroke-width="1"
			opacity="0.9"
		/>

		<!-- 시계 숫자 표시 (12, 3, 6, 9) -->
		<line
			x1="12"
			y1="4.125"
			x2="12"
			y2="5.625"
			stroke="currentColor"
			stroke-width="1.2"
			stroke-linecap="round"
		/>
		<line
			x1="19.875"
			y1="12"
			x2="18.375"
			y2="12"
			stroke="currentColor"
			stroke-width="1.2"
			stroke-linecap="round"
		/>
		<line
			x1="12"
			y1="19.875"
			x2="12"
			y2="18.375"
			stroke="currentColor"
			stroke-width="1.2"
			stroke-linecap="round"
		/>
		<line
			x1="4.125"
			y1="12"
			x2="5.625"
			y2="12"
			stroke="currentColor"
			stroke-width="1.2"
			stroke-linecap="round"
		/>

		<!-- 작은 눈금 (시계 방향) -->
		<g opacity="0.6">
			<line
				x1="12"
				y1="3.375"
				x2="12"
				y2="4.125"
				stroke="currentColor"
				stroke-width="0.8"
				stroke-linecap="round"
			/>
			<line
				x1="20.625"
				y1="12"
				x2="19.875"
				y2="12"
				stroke="currentColor"
				stroke-width="0.8"
				stroke-linecap="round"
			/>
			<line
				x1="12"
				y1="20.625"
				x2="12"
				y2="19.875"
				stroke="currentColor"
				stroke-width="0.8"
				stroke-linecap="round"
			/>
			<line
				x1="3.375"
				y1="12"
				x2="4.125"
				y2="12"
				stroke="currentColor"
				stroke-width="0.8"
				stroke-linecap="round"
			/>
		</g>

		<!-- 시계 중심 -->
		<circle cx="12" cy="12" r="1" fill="currentColor" />

		<!-- 시침 (9시 방향 - 출근 시간 표현) -->
		<line
			x1="12"
			y1="12"
			x2="9"
			y2="12"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
		/>

		<!-- 분침 (12시 방향) -->
		<line
			x1="12"
			y1="12"
			x2="12"
			y2="7.125"
			stroke="currentColor"
			stroke-width="1.2"
			stroke-linecap="round"
		/>
	</svg>
</template>

<script setup>
// 시계 아이콘 컴포넌트
</script>
