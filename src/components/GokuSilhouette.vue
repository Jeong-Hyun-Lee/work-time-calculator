<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 120 140"
		class="goku-svg"
	>
		<!-- 손오공 실루엣 - 슈퍼 사이어인 에너지파 발사 자세 -->
		
		<!-- 스파이키 헤어 (슈퍼 사이어인) -->
		<path
			d="M 60 20 L 55 12 L 58 10 L 60 15 L 62 10 L 65 12 L 60 20 Z"
			fill="#ffffff"
			opacity="0.95"
		/>
		<path
			d="M 60 18 L 52 14 L 55 12 L 60 16 L 65 12 L 68 14 L 60 18 Z"
			fill="#ffffff"
			opacity="0.95"
		/>
		<circle cx="60" cy="28" r="11" fill="#ffffff" opacity="0.95" />
		
		<!-- 얼굴 -->
		<ellipse cx="60" cy="32" rx="9" ry="10" fill="#ffffff" opacity="0.95" />
		
		<!-- 몸통 (앞으로 기울어진 자세) -->
		<ellipse
			cx="58"
			cy="58"
			rx="10"
			ry="18"
			fill="#ffffff"
			opacity="0.95"
			transform="rotate(-5 58 58)"
		/>
		
		<!-- 왼팔 (가슴 앞으로 구부러진 자세) -->
		<path
			d="M 48 52 Q 45 48 42 50 Q 40 52 42 56 Q 44 58 46 57 Q 48 55 48 52 Z"
			fill="#ffffff"
			opacity="0.95"
		/>
		<!-- 왼손 (손가락 펼침) -->
		<path
			d="M 40 54 L 38 52 L 39 50 L 40 52 L 41 50 L 42 52 L 40 54 Z"
			fill="#ffffff"
			opacity="0.95"
		/>
		
		<!-- 오른팔 (가슴 앞으로 구부러진 자세) -->
		<path
			d="M 68 52 Q 71 48 74 50 Q 76 52 74 56 Q 72 58 70 57 Q 68 55 68 52 Z"
			fill="#ffffff"
			opacity="0.95"
		/>
		<!-- 오른손 (손가락 펼침, 에너지 준비) -->
		<path
			d="M 76 54 L 78 52 L 77 50 L 76 52 L 75 50 L 74 52 L 76 54 Z"
			fill="#ffffff"
			opacity="0.95"
		/>
		
		<!-- 왼다리 (앞으로 구부러진 자세) -->
		<path
			d="M 52 76 Q 50 85 48 95 Q 50 100 52 98 Q 54 90 56 80 Q 54 78 52 76 Z"
			fill="#ffffff"
			opacity="0.95"
		/>
		<!-- 왼발 -->
		<ellipse cx="50" cy="100" rx="6" ry="4" fill="#ffffff" opacity="0.95" />
		
		<!-- 오른다리 (뒤로 뻗은 자세) -->
		<path
			d="M 64 76 Q 66 85 68 95 Q 66 100 64 98 Q 62 90 60 80 Q 62 78 64 76 Z"
			fill="#ffffff"
			opacity="0.95"
		/>
		<!-- 오른발 -->
		<ellipse cx="70" cy="100" rx="6" ry="4" fill="#ffffff" opacity="0.95" />
		
		<!-- 에너지파 (손에서 발사되는 효과) -->
		<circle cx="78" cy="52" r="7" fill="#00bfff" opacity="0.9">
			<animate
				attributeName="r"
				values="7;11;7"
				dur="1s"
				repeatCount="indefinite"
			/>
			<animate
				attributeName="opacity"
				values="0.9;1;0.9"
				dur="1s"
				repeatCount="indefinite"
			/>
		</circle>
		<circle cx="82" cy="50" r="5" fill="#00ffff" opacity="0.7">
			<animate
				attributeName="r"
				values="5;8;5"
				dur="1s"
				repeatCount="indefinite"
			/>
		</circle>
		<circle cx="86" cy="48" r="4" fill="#87ceeb" opacity="0.5">
			<animate
				attributeName="r"
				values="4;6;4"
				dur="1s"
				repeatCount="indefinite"
			/>
		</circle>
		<circle cx="90" cy="46" r="3" fill="#b0e0e6" opacity="0.3">
			<animate
				attributeName="r"
				values="3;5;3"
				dur="1s"
				repeatCount="indefinite"
			/>
		</circle>
	</svg>
</template>

<script setup>
// 손오공 실루엣 SVG 컴포넌트
</script>

<style scoped>
.goku-svg {
	width: 100%;
	height: 100%;
}
</style>

