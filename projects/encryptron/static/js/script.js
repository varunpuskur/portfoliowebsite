// document.getElementById('fileInput').addEventListener('change', function() {
//     var fileName = this.files[0].name;
//     document.getElementById('fileName').textContent = fileName;
//     document.getElementById('reset-btn').style.display = 'block';
//     document.getElementById('next-btn-step1').style.display = 'block';
// });

// function resetFileInput() {
//     document.getElementById('fileInput').value = '';
//     document.getElementById('fileName').textContent = 'Browse Files';
//     document.getElementById('reset-btn').style.display = 'none';
//     document.getElementById('next-btn-step1').style.display = 'none';
//     document.getElementById('step1').style.display = 'block';
//     document.getElementById('step2').style.display = 'none';
//     document.getElementById('step2-intro').style.display = 'none';
//     document.getElementById('step3').style.display = 'none';
//     document.getElementById('step3-intro').style.display = 'none';
// }

// function showStep1() {
//     document.getElementById('step1').style.display = 'block';
//     document.getElementById('step2').style.display = 'none';
//     document.getElementById('step2-intro').style.display = 'none';
//     document.getElementById('step3').style.display = 'none';
//     document.getElementById('step3-intro').style.display = 'none';
//     document.getElementById('success-message').style.display = 'none';
//     document.getElementById('download-success-message').style.display = 'none';
//     document.getElementById('main-menu-btn').style.display = 'none';
// }

// function showStep2() {
//     document.getElementById('step1').style.display = 'none';
//     document.getElementById('step2').style.display = 'block';
//     document.getElementById('step2-intro').style.display = 'flex';
// }

// function showStep3() {
//     document.getElementById('step3').style.display = 'block';
//     document.getElementById('step3-intro').style.display = 'flex';
//     document.getElementById('step2').style.display = 'none';  // Hide step 2
//     var fileName = document.getElementById('fileInput').files[0].name;
//     document.getElementById('success-message').innerHTML = '<strong>' + fileName + '</strong> was successfully encrypted and is ready to be downloaded';
//     document.getElementById('success-message').style.display = 'block';
// }

// function showDownloadSuccess() {
//     document.getElementById('download-success-message').style.display = 'block';
//     document.getElementById('main-menu-btn').style.display = 'block';
// }
