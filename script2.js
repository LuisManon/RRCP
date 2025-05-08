document.addEventListener("DOMContentLoaded", function () {
    const videoIds = [
        "qhlG9qqqmTg","9TrERvI8yrw", "6CazaNiv3Gc", "IpydWLuUNZA", "ev4PP7A_2GU",
        "Ww1dME4C0Zg", "VdKfqeD_qU4", "g6aq3jGcyqc", "h_Llab5ICHU",
        "ywr9Wuboivg", "pwSU8_viI2Q", "hzyAmnWWpgQ", "5zOMYEZIrU4",
        "o6cLWtnCya0", "JILFUo_jmCE", "qqO528LsW00", "8pBNUXyZVuk",
        "VKjfA0W927U", "iEno-hso2Mc", "AOvw-YMSvyE"
    ];
    
    let startIndex = 0;
    let videosPerPage = window.innerWidth < 768 ? 1 : 2; 
    const container = document.getElementById("video-container");

    function loadVideos() {
        container.innerHTML = ""; 
        container.style.display = "flex";

        for (let i = 0; i < videosPerPage; i++) {
            let index = (startIndex + i) % videoIds.length; 
            const videoDiv = document.createElement("div");
            videoDiv.classList.add("video-wrapper");
            videoDiv.innerHTML = `
                <iframe src="https://www.youtube.com/embed/${videoIds[index]}" frameborder="0" allowfullscreen></iframe>
            `;
            container.appendChild(videoDiv);
        }
    }

    function updateVideosPerPage() {
        videosPerPage = window.innerWidth < 768 ? 1 : 2; 
        loadVideos();
    }

    document.getElementById("previousBtn").addEventListener("click", function () {
        startIndex = (startIndex - videosPerPage + videoIds.length) % videoIds.length;
        loadVideos();
    });

    document.getElementById("nextBtn").addEventListener("click", function () {
        startIndex = (startIndex + videosPerPage) % videoIds.length;
        loadVideos();
    });

    window.addEventListener("resize", updateVideosPerPage);
    loadVideos();
});
