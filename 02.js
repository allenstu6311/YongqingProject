Vue.createApp({
    data(){
        return{
            favourite:[],
            map:null,
        }
    },
    methods: {
        initMap(){
            const blackIcon = new L.Icon({
                iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })
            this.map = L.map('map').setView([51.5, -0.09], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
            L.marker([51.5, -0.09],{ icon: blackIcon }).addTo(this.map)
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();
              L.marker([51.5, -0.09],{ icon: blackIcon }).addTo(this.map)
        },
        getFavouriteInfo(){
            let favouriteInfo = localStorage.getItem("myFavorite");
            this.favourite = JSON.parse(favouriteInfo)

        }
        
    },
    mounted() {
        this.initMap()
    },
    created() {
        this.getFavouriteInfo()
    },
 }).mount("#app")