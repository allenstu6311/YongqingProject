Vue.createApp({
    data() {
        return {
            favourite: [],
            removeFavorite: [],
            map: null,
            showLightBox: false,
            edit: [],
            attractionName: '',
            attractionAddress: '',
            attractionDistrict: '',
            oldName: '',
            oldAddress: '',
            oldDistrict: '',
            removeCheck:'',

        }
    },
    methods: {
        initMap() {
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
            L.marker([51.5, -0.09], { icon: blackIcon }).addTo(this.map)
                .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
                .openPopup();
            L.marker([51.5, -0.09], { icon: blackIcon }).addTo(this.map)
        },
        updateMap(id){
            const blackIcon = new L.Icon({
                iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
            let positionInfo = this.favourite.find(item=>item.id===id)

            if(positionInfo){
                this.map.setView([`${positionInfo.lat}`,`${positionInfo.long}`,13])

                L.marker([`${positionInfo.lat}`,`${positionInfo.long}`],{ icon: blackIcon }).addTo(this.map)
                .bindPopup(`
                <p>景點名稱:${positionInfo.name}</p>
                <p>電話:${positionInfo.tel}`,)
                .openPopup();
           
                  L.marker([`${positionInfo.lat}`,`${positionInfo.long}`],{ icon: blackIcon }).addTo(this.map)
            }

       
        },
        editTarget(item) {
            this.showLightBox = true
            this.attractionName = item.name
            this.oldName = item.name

            this.attractionAddress = item.address
            this.oldAddress = item.address

            this.attractionDistrict = item.district
            this.oldDistrict = item.district


        },
        editFinish() {

            let index = this.favourite.findIndex(item => item.name === this.oldName)

            this.favourite[index].name = this.attractionName
            this.showLightBox = false
            this.favourite[index].address = this.attractionAddress
            this.showLightBox = false
            this.favourite[index].district = this.attractionDistrict
            this.showLightBox = false

            this.setLocalStorage()
        },
        setLocalStorage() {
            localStorage.setItem("myFavorite", JSON.stringify(this.favourite))
        },
        getFavouriteInfo() {
            let favouriteInfo = localStorage.getItem("myFavorite");
            this.favourite = JSON.parse(favouriteInfo)

        },
        deleteFavorite(id) {
            let index = this.favourite.findIndex(item => item.id === id)
            this.favourite.splice(index, 1)

            this.setLocalStorage()
        },
        removeTotal() {
      
            for (let i = this.favourite.length - 1; i >= 0; i--) {
                a = this.favourite[i];
                for (let j = this.removeFavorite.length - 1; j >= 0; j--) {
                    b = this.removeFavorite[j]
                    if (a == b) {
                        this.favourite.splice(i, 1)
                        this.removeFavorite.splice(j, 1)

                        break;
                    }
                }
            }
            this.setLocalStorage()
        },
        checkAll(){
            if(this.removeCheck){
                this.removeFavorite=[]
            }else{
                this.removeFavorite = this.favourite
            }
        },

    },
    watch: {
        removeFavorite: {
            handler(newVal) {
                // console.log(newVal)
            }
        }
    },
    mounted() {
        this.initMap()
    },
    created() {
        this.getFavouriteInfo()

    },
}).mount("#app")