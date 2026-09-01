import { ref } from 'vue'

const ROWS = 10
const MAX_PLAYERS = 8
const RUNG_CHANCE = 0.45

function randomInt(max) {
	const buffer = new Uint32Array(1)
	crypto.getRandomValues(buffer)
	return buffer[0] % max
}

function parseList(raw) {
	return raw
		.split(/[\n,]/)
		.map((item) => item.trim())
		.filter((item) => item.length > 0)
}

// 각 행마다 인접하지 않는 가로줄을 무작위로 배치
function buildRungs(columnCount) {
	const result = []

	for (let row = 1; row <= ROWS; row++) {
		let col = 0
		while (col < columnCount - 1) {
			if (randomInt(100) < RUNG_CHANCE * 100) {
				result.push({ row, col })
				col += 2
			} else {
				col += 1
			}
		}
	}

	return result
}

export function useLadder() {
	const namesInput = ref('')
	const prizesInput = ref('')
	const players = ref([])
	const prizes = ref([])
	const rungs = ref([])
	const results = ref([])
	const error = ref('')
	const activeIndex = ref(null)

	const hasRung = (row, col) =>
		rungs.value.some((rung) => rung.row === row && rung.col === col)

	// 특정 출발 칸에서 사다리를 타고 내려간 경로를 [col, row] 좌표 배열로 반환
	const pathFor = (startCol) => {
		const points = [[startCol, 0]]
		let col = startCol

		for (let row = 1; row <= ROWS; row++) {
			let nextCol = col
			if (hasRung(row, col)) {
				nextCol = col + 1
			} else if (hasRung(row, col - 1)) {
				nextCol = col - 1
			}

			if (nextCol !== col) {
				points.push([col, row])
				points.push([nextCol, row])
				col = nextCol
			}
		}

		points.push([col, ROWS + 1])
		return points
	}

	const generate = () => {
		error.value = ''
		activeIndex.value = null

		const parsedPlayers = parseList(namesInput.value)

		if (parsedPlayers.length < 2) {
			error.value = '참가자를 2명 이상 입력해주세요'
			results.value = []
			players.value = []
			return
		}

		if (parsedPlayers.length > MAX_PLAYERS) {
			error.value = `참가자는 최대 ${MAX_PLAYERS}명까지 입력할 수 있어요`
			results.value = []
			players.value = []
			return
		}

		const parsedPrizes = parseList(prizesInput.value)

		if (parsedPrizes.length > 0 && parsedPrizes.length !== parsedPlayers.length) {
			error.value = '결과 개수가 참가자 수와 같아야 해요'
			results.value = []
			players.value = []
			return
		}

		// 결과를 비워두면 당첨 1개 + 나머지 꽝으로 자동 구성
		const finalPrizes =
			parsedPrizes.length > 0
				? parsedPrizes
				: parsedPlayers.map((_, index) => (index === 0 ? '당첨' : '꽝'))

		// 결과 자체도 섞어서 어느 칸이 당첨인지 알 수 없게 함
		const shuffledPrizes = [...finalPrizes]
		for (let i = shuffledPrizes.length - 1; i > 0; i--) {
			const j = randomInt(i + 1)
			;[shuffledPrizes[i], shuffledPrizes[j]] = [
				shuffledPrizes[j],
				shuffledPrizes[i],
			]
		}

		players.value = parsedPlayers
		prizes.value = shuffledPrizes
		rungs.value = buildRungs(parsedPlayers.length)

		results.value = parsedPlayers.map((name, index) => {
			const path = pathFor(index)
			const endCol = path[path.length - 1][0]
			return { name, outcome: shuffledPrizes[endCol] }
		})
	}

	const highlight = (index) => {
		activeIndex.value = activeIndex.value === index ? null : index
	}

	return {
		namesInput,
		prizesInput,
		players,
		prizes,
		rungs,
		results,
		error,
		activeIndex,
		rows: ROWS,
		generate,
		pathFor,
		highlight,
	}
}
