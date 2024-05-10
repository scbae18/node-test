const axios = require('axios');
const readline = require('readline');

const apiKey = 'AIzaSyAwxXTuPNHNn9KdnVDtVsqPl_3Ogl6U4c0';
const origin = '수원역';
const destination = '홍대입구역';

const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=transit&key=${apiKey}`;

axios.get(apiUrl)
    .then(response => {
        const routes = response.data.routes;
        if (routes.length > 0) {
            // 각 경로의 간단한 총 소요 시간 출력
            routes.forEach((route, index) => {
                const totalDuration = route.legs.reduce((acc, leg) => acc + leg.duration.value, 0);
                console.log(`Route ${index + 1}: Total Duration: ${totalDuration / 60} minutes`);
            });

            // 사용자가 선택한 경로 번호 입력 받기
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('Enter the route number you want to see details for: ', (selectedRouteIndex) => {
                const selectedRoute = routes[selectedRouteIndex - 1];
                if (selectedRoute) {
                    // 선택한 경로의 세부 정보 출력
                    console.log(`Selected Route: ${selectedRouteIndex}`);
                    selectedRoute.legs.forEach((leg, index) => {
                        console.log(`Leg ${index + 1}:`);
                        console.log(`- Start Address: ${leg.start_address}`);
                        console.log(`- End Address: ${leg.end_address}`);
                        console.log(`- Distance: ${leg.distance.text}`);
                        console.log(`- Duration: ${leg.duration.text}`);
                        console.log(`- Steps:`);
                        leg.steps.forEach((step, stepIndex) => {
                            console.log(`  Step ${stepIndex + 1}:`);
                            console.log(`  - Travel Mode: ${step.travel_mode}`);
                            if (step.transit_details) {
                                console.log(`    - Transit Mode: ${step.transit_details.line.vehicle.type}`);
                                console.log(`    - Transit Line: ${step.transit_details.line.short_name}`);
                                console.log(`    - Departure Time: ${new Date(step.transit_details.departure_time.value * 1000).toLocaleTimeString()}`);
                                console.log(`    - Arrival Time: ${new Date(step.transit_details.arrival_time.value * 1000).toLocaleTimeString()}`);
                            }
                        });
                    });
                } else {
                    console.log('Invalid route number.');
                }
                rl.close();
            });
        } else {
            console.log('No routes found.');
        }
    })
    .catch(error => {
        console.error('Error fetching directions:', error);
    });
