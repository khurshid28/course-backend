import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Sample videos from Google
const videos = [
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    name: 'Big Buck Bunny',
    isFree: true,
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    name: 'Elephants Dream',
    isFree: true,
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    name: 'For Bigger Blazes',
    isFree: false,
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    name: 'For Bigger Escapes',
    isFree: false,
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    name: 'For Bigger Fun',
    isFree: false,
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    name: 'For Bigger Joyrides',
    isFree: false,
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    name: 'For Bigger Meltdowns',
    isFree: false,
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    name: 'Sintel',
    isFree: false,
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    name: 'Subaru Outback',
    isFree: false,
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    name: 'Tears of Steel',
    isFree: false,
  },
];

async function uploadVideo(url: string, name: string, isFree: boolean, index: number) {
  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📹 [${index + 1}/${videos.length}] Uploading: ${name}`);
    console.log(`🔗 URL: ${url}`);
    console.log(`🆓 Free: ${isFree ? 'Yes' : 'No'}`);
    console.log(`${'='.repeat(60)}`);

    const response = await axios.post(
      `${BASE_URL}/upload/video-from-url`,
      {
        url,
        isFree: isFree.toString(),
      },
      {
        timeout: 120000, // 2 minutes timeout
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            process.stdout.write(`\r⏳ Upload progress: ${percentCompleted}%`);
          }
        },
      },
    );

    console.log('\n✅ Upload successful!');
    console.log(`📁 Saved as: ${response.data.filename}`);
    console.log(`🔗 Path: ${response.data.path}`);
    console.log(`⏱️  Duration: ${response.data.duration}s`);
    console.log(`📊 Size: ${(response.data.size / 1024 / 1024).toFixed(2)} MB`);
    
    return response.data;
  } catch (error: any) {
    console.error(`\n❌ Error uploading ${name}:`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data?.message || error.message}`);
    } else if (error.request) {
      console.error('No response received from server');
      console.error(error.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

async function uploadAllVideos() {
  console.log('🚀 Starting video upload process...');
  console.log(`Total videos to upload: ${videos.length}\n`);

  const results = [];
  const errors = [];

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    
    try {
      const result = await uploadVideo(video.url, video.name, video.isFree, i);
      results.push({ video: video.name, result });
      
      // Wait 2 seconds between uploads to avoid overwhelming the server
      if (i < videos.length - 1) {
        console.log('\n⏳ Waiting 2 seconds before next upload...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      errors.push({ video: video.name, error: error.message });
      console.log('\n⚠️  Continuing with next video...\n');
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('📊 UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${results.length}/${videos.length}`);
  console.log(`❌ Failed: ${errors.length}/${videos.length}`);

  if (results.length > 0) {
    console.log('\n✅ Successfully uploaded videos:');
    results.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.video} → ${r.result.filename}`);
    });
  }

  if (errors.length > 0) {
    console.log('\n❌ Failed uploads:');
    errors.forEach((e, i) => {
      console.log(`  ${i + 1}. ${e.video}: ${e.error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Upload process completed!');
  console.log('='.repeat(60) + '\n');
}

// Run the upload process
uploadAllVideos()
  .then(() => {
    console.log('✅ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
