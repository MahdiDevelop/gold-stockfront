// const sidebarToggle = document.querySelector("#sidebar-toggle")
// sidebarToggle.addEventListener("click",function(){
//     document.querySelector("#sidebar").classList.toggle("collapsed");
// });
// // Data for Chart 1
// const data1 = {
//     labels: ['January', 'February', 'March', 'April', 'May'],
//     datasets: [{
//       label: 'Sales',
//       data: [50, 60, 70, 80, 90],
//       backgroundColor: 'rgba(255, 99, 132, 0.2)',
//       borderColor: 'rgba(255, 99, 132, 1)',
//       borderWidth: 1
//     }]
//   };

//   // Data for Chart 2
//   const data2 = {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
//     datasets: [{
//       label: 'Votes',
//       data: [12, 19, 3, 5, 2],
//       backgroundColor: 'rgba(54, 162, 235, 0.2)',
//       borderColor: 'rgba(54, 162, 235, 1)',
//       borderWidth: 1
//     }]
//   };

//   // Chart options
//   const options = {
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   };

//   // Render Chart 1
//   const chart1 = new Chart(document.getElementById('chart1'), {
//     type: 'bar',
//     data: data1,
//     options: options
//   });

//   // Render Chart 2
//   const chart2 = new Chart(document.getElementById('chart2'), {
//     type: 'bar',
//     data: data2,
//     options: options
//   });