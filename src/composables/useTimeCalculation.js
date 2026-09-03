import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { t } from '../i18n'

export function useTimeCalculation(startTime, isHalfDay) {
	const currentTime = ref(dayjs())
	const endTime = ref(null)
	const diffInSeconds = ref(0)

	const formattedStartTime = computed(() => {
		if (!startTime.value) return t('time.empty')
		const [hours, minutes] = startTime.value.split(':')
		return dayjs()
			.hour(parseInt(hours))
			.minute(parseInt(minutes))
			.format(t('time.format'))
	})

	const formattedCurrentTime = computed(() => {
		return currentTime.value.format(t('time.format'))
	})

	const formattedEndTime = computed(() => {
		if (!endTime.value) return t('time.empty')
		return endTime.value.format(t('time.format'))
	})

	const hours = computed(() => {
		if (diffInSeconds.value <= 0) return 0
		const diffInMinutes = Math.floor(diffInSeconds.value / 60)
		return Math.floor(diffInMinutes / 60)
	})

	const minutes = computed(() => {
		if (diffInSeconds.value <= 0) return 0
		const diffInMinutes = Math.floor(diffInSeconds.value / 60)
		return diffInMinutes % 60
	})

	const remainingSeconds = computed(() => {
		if (diffInSeconds.value <= 0) return 0
		return diffInSeconds.value % 60
	})

	const overdueHours = computed(() => {
		if (diffInSeconds.value >= 0) return 0
		const overdueSeconds = Math.abs(diffInSeconds.value)
		const overdueMinutes = Math.floor(overdueSeconds / 60)
		return Math.floor(overdueMinutes / 60)
	})

	const overdueMins = computed(() => {
		if (diffInSeconds.value >= 0) return 0
		const overdueSeconds = Math.abs(diffInSeconds.value)
		const overdueMinutes = Math.floor(overdueSeconds / 60)
		return overdueMinutes % 60
	})

	const overdueSecs = computed(() => {
		if (diffInSeconds.value >= 0) return 0
		const overdueSeconds = Math.abs(diffInSeconds.value)
		return overdueSeconds % 60
	})

	const calculateTime = () => {
		if (!startTime.value) return

		const now = dayjs()
		currentTime.value = now

		const [hours, minutes] = startTime.value.split(':')
		const start = dayjs()
			.hour(parseInt(hours))
			.minute(parseInt(minutes))
			.second(0)
			.millisecond(0)

		// 하프데이 체크박스가 체크되면 4시간, 아니면 8시간 (9시간은 1점심시간 포함)
		const workHours = isHalfDay?.value ? 4 : 9
		const end = start.add(workHours, 'hour')
		endTime.value = end

		const diff = end.diff(now, 'second')
		diffInSeconds.value = diff
	}

	return {
		currentTime,
		endTime,
		diffInSeconds,
		formattedStartTime,
		formattedCurrentTime,
		formattedEndTime,
		hours,
		minutes,
		remainingSeconds,
		overdueHours,
		overdueMins,
		overdueSecs,
		calculateTime,
	}
}
