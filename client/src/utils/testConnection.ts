enum TestConnectionConfigs {
  MIN_SPEED_REQUIREMENT = 500, // in kbps
  IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Snake_River_%285mb%29.jpg', // Prompt: insert your uploaded image url for testing here.
  DOWNLOAD_SIZE = 5245329, // Prompt: update download size of the uploaded image.
  TESTING_TOTAL = 3,
}

const loadImageProcess = () => {
  return new Promise<number>(resolve => {
    const download = new Image()
    const startTime = new Date().getTime()
    download.src = TestConnectionConfigs.IMAGE_URL + '?n=' + Math.random()

    download.onload = async () => {
      const endTime = new Date().getTime()
      const duration = (endTime - startTime) / 1000
      const bitsLoaded = TestConnectionConfigs.DOWNLOAD_SIZE * 8
      const speed = bitsLoaded / duration / 1024
      resolve(speed)
    }
  })
}

type BandwithTestResults = {
  totalSpeed: number
  internetSpeed: number
  passedConnectionTest: boolean
}
const checkBandwidth = async (): Promise<BandwithTestResults> => {
  let sumSpeed = 0
  let averageSpeed = 0

  for (let i = 0; i < TestConnectionConfigs.TESTING_TOTAL; i++) {
    sumSpeed += await loadImageProcess()
  }

  averageSpeed = sumSpeed / TestConnectionConfigs.TESTING_TOTAL

  return {
    totalSpeed: parseInt(sumSpeed.toFixed(0), 10),
    internetSpeed: parseInt(averageSpeed.toFixed(0), 10),
    passedConnectionTest:
      averageSpeed > TestConnectionConfigs.MIN_SPEED_REQUIREMENT,
  }
}

export const testConnection = async (): Promise<boolean> => {
  const {
    totalSpeed,
    internetSpeed,
    passedConnectionTest,
  } = await checkBandwidth()

  const connectionResult = {
    total_bandwidth_used_kb: totalSpeed,
    average_bandwidth_kbps: internetSpeed,
  }
  // Prompt: console log the connectionResult object.
  console.log('Test connection result:', connectionResult)

  return passedConnectionTest
}
