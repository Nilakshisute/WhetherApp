
        // Initialize Feather icons
        document.addEventListener('DOMContentLoaded', () => {
            feather.replace();
        });
    
        const apiKey = "e3719cb442eab92193f30ee491901d2c";
        
        // Add event listener for Enter key
        document.getElementById("city").addEventListener(function(event) {
            if (event.key === "Enter") {
                getWeather();
            }
        });
        
        async function getWeather() {
            const city = document.getElementById("city").value.trim();
            const loadingElement = document.getElementById("loading");
            const resultElement = document.getElementById("result");
            
            if (!city) {
                showNotification("Please enter a city name", "error");
                return;
            }
            
            // Show loading animation
            loadingElement.classList.remove("hidden");
            resultElement.innerHTML = "";
            
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            
            try {
                let response = await fetch(url);
                
                // Hide loading animation
                loadingElement.classList.add("hidden");
                
                if (!response.ok) {
                    showNotification("City not found or connection error", "error");
                    return;
                }
                
                let info = await response.json();
                console.log(info);
                
                // Get weather condition
                const weatherCode = info.weather[0].id;
                const isDay = isItDaytime(info.sys.sunrise, info.sys.sunset, info.dt);
                
                // Get weather icon
                const weatherIcon = getWeatherIcon(weatherCode, isDay);
                
                resultElement.innerHTML = `
                    <div class='p-6 rounded-xl bg-white/80 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-xl'>
                        <div class="flex flex-col sm:flex-row items-center justify-between">
                            <div>
                                <h3 class='text-2xl font-bold text-gray-800 mb-1'>${info.name}, ${info.sys.country}</h3>
                                <p class='text-gray-600 flex items-center'>
                                    <i data-feather="clock" class="h-4 w-4 mr-1"></i> 
                                    ${new Date().toLocaleString()}
                                </p>
                            </div>
                            <div class="text-center mt-4 sm:mt-0">
                                <div class="weather-icon text-6xl mb-2">${weatherIcon}</div>
                                <p class='text-purple-700 font-medium'>${info.weather[0].description}</p>
                            </div>
                        </div>
                        
                        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg shadow-sm flex items-center gap-3 transition-transform hover:scale-105">
                                <i data-feather="thermometer" class="h-6 w-6 text-purple-600"></i>
                                <div>
                                    <p class='text-xs text-gray-500'>Temperature</p>
                                    <p class='text-2xl font-bold text-gray-800'>${info.main.temp.toFixed(1)}°C</p>
                                </div>
                            </div>
                            
                            <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg shadow-sm flex items-center gap-3 transition-transform hover:scale-105">
                                <i data-feather="droplet" class="h-6 w-6 text-purple-600"></i>
                                <div>
                                    <p class='text-xs text-gray-500'>Humidity</p>
                                    <p class='text-2xl font-bold text-gray-800'>${info.main.humidity}%</p>
                                </div>
                            </div>
                            
                            <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg shadow-sm flex items-center gap-3 transition-transform hover:scale-105">
                                <i data-feather="wind" class="h-6 w-6 text-purple-600"></i>
                                <div>
                                    <p class='text-xs text-gray-500'>Wind Speed</p>
                                    <p class='text-2xl font-bold text-gray-800'>${info.wind.speed} m/s</p>
                                </div>
                            </div>
                            
                            <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg shadow-sm flex items-center gap-3 transition-transform hover:scale-105">
                                <i data-feather="eye" class="h-6 w-6 text-purple-600"></i>
                                <div>
                                    <p class='text-xs text-gray-500'>Visibility</p>
                                    <p class='text-2xl font-bold text-gray-800'>${(info.visibility / 1000).toFixed(1)} km</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-6 grid grid-cols-2 gap-4">
                            <div class="bg-gradient-to-r from-amber-50 to-pink-50 p-4 rounded-lg shadow-sm transition-transform hover:scale-105">
                                <div class="flex items-center gap-2 mb-2">
                                    <i data-feather="sunrise" class="h-5 w-5 text-amber-600"></i>
                                    <p class='text-sm text-gray-700'>Sunrise</p>
                                </div>
                                <p class='text-lg font-bold text-gray-800'>${new Date(info.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                            
                            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg shadow-sm transition-transform hover:scale-105">
                                <div class="flex items-center gap-2 mb-2">
                                    <i data-feather="sunset" class="h-5 w-5 text-indigo-600"></i>
                                    <p class='text-sm text-gray-700'>Sunset</p>
                                </div>
                                <p class='text-lg font-bold text-gray-800'>${new Date(info.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                        </div>
                        
                        <div class="mt-6">
                            <div class="bg-white/80 p-4 rounded-lg shadow-sm">
                                <div class="flex justify-between items-center mb-2">
                                    <p class='text-sm text-gray-700'>Feels like</p>
                                    <p class='font-bold text-gray-800'>${info.main.feels_like.toFixed(1)}°C</p>
                                </div>
                                <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style="width: ${Math.min(100, (info.main.feels_like / 50) * 100)}%"></div>
                                </div>
                            </div>
                            
                            <div class="bg-white/80 p-4 rounded-lg shadow-sm mt-3">
                                <div class="flex justify-between items-center mb-2">
                                    <p class='text-sm text-gray-700'>Pressure</p>
                                    <p class='font-bold text-gray-800'>${info.main.pressure} hPa</p>
                                </div>
                                <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style="width: ${Math.min(100, (info.main.pressure / 1050) * 100)}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                
                // Re-initialize Feather icons for the newly added content
                feather.replace();
                
                // Add entrance animations with GSAP
                animateResults();
                
            } catch (error) {
                loadingElement.classList.add("hidden");
                console.log(error);
                showNotification("Error fetching weather data", "error");
            }
        }
        
        function showNotification(message, type) {
            const notificationId = "notification-" + Date.now();
            const notifClass = type === "error" ? "bg-red-500" : "bg-green-500";
            
            const notification = document.createElement("div");
            notification.id = notificationId;
            notification.className = `${notifClass} text-white p-3 rounded-lg shadow-lg fixed top-4 right-4 z-50 flex items-center opacity-0 transform translate-y-[-20px]`;
            notification.innerHTML = `
                <i data-feather="${type === "error" ? "alert-circle" : "check-circle"}" class="h-5 w-5 mr-2"></i>
                <span>${message}</span>
            `;
            
            document.body.appendChild(notification);
            feather.replace();
            
            // Animate in
            gsap.to(`#${notificationId}`, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                onComplete: () => {
                    // Animate out after 3 seconds
                    setTimeout(() => {
                        gsap.to(`#${notificationId}`, {
                            opacity: 0,
                            y: -20,
                            duration: 0.3,
                            onComplete: () => {
                                document.body.removeChild(notification);
                            }
                        });
                    }, 3000);
                }
            });
        }
        
        function getWeatherIcon(code, isDay) {
            // Map weather code to appropriate emoji
            if (code >= 200 && code < 300) return "⛈️"; // Thunderstorm
            if (code >= 300 && code < 400) return "🌧️"; // Drizzle
            if (code >= 500 && code < 600) return "🌧️"; // Rain
            if (code >= 600 && code < 700) return "❄️"; // Snow
            if (code >= 700 && code < 800) return "🌫️"; // Atmosphere (fog, mist, etc)
            if (code === 800) return isDay ? "☀️" : "🌙"; // Clear
            if (code > 800) return isDay ? "⛅" : "☁️"; // Clouds
            
            return "🌈"; // Default
        }
        
        function isItDaytime(sunrise, sunset, current) {
            return current > sunrise && current < sunset;
        }
        
        function animateResults() {
            gsap.from("#result > div", {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: "power2.out"
            });
            
            gsap.from("#result > div > div", {
                opacity: 0,
                y: 10,
                duration: 0.5,
                stagger: 0.1,
                delay: 0.2,
                ease: "power2.out"
            });
        }
    