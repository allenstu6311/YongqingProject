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
            currentPage: 1,
            extraPage: [],
            totalPages:'',
            showTarget_1:0,
            showTarget_2:5,
            pageShow:5,
            weatherData:[],
            targetArea:[],
            rain:'',
            weather:'',
            temperature:'',
            showList: false,
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
        removeMap() {
            this.map.eachLayer((layer) => {
              if (layer instanceof L.Marker) {
                this.map.removeLayer(layer);
              }
            });
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
            let reg = new RegExp("^[\u4e00-\u9fa5]+$");
            if(!reg.test(this.attractionName)){
                alert("不能輸入中文以外的其他字元")
            }else{
            this.favourite[index].name = this.attractionName
            this.showLightBox = false
            this.favourite[index].address = this.attractionAddress
            this.showLightBox = false
            this.favourite[index].district = this.attractionDistrict
            this.showLightBox = false
            }

            this.setLocalStorage()
        },
        setLocalStorage() {
            localStorage.setItem("myFavorite", JSON.stringify(this.favourite))
        },
        getFavouriteInfo() {
            let favouriteInfo = localStorage.getItem("myFavorite");
            this.favourite = JSON.parse(favouriteInfo)

            this.totalPages = this.favourite? Math.ceil(this.favourite.length / 5):0
            this.favourite = this.favourite?this.favourite.slice(this.showTarget_1,this.showTarget_2):[]
            this.favourite = this.favourite.reverse()

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
        chosePage(i) {
            this.currentPage = i
            this.showTarget_2 =i*5
            this.showTarget_1 =  this.showTarget_2-5
            this. getFavouriteInfo()
        },
        prevPage() {
            if (this.currentPage > 0) {
                this.currentPage -= 1
                this.showTarget_2 =this.currentPage*5
                this.showTarget_1 =  this.showTarget_2-5
                this. getFavouriteInfo()
            }
        },
        nextPage() {
            if (this.currentPage < 55) {
                this.currentPage += 1
                this.showTarget_2 =this.currentPage*5
                this.showTarget_1 =  this.showTarget_2-5
                this. getFavouriteInfo()
            }
        },
        getWeather(name){
            axios.get('https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-077?Authorization=CWB-49AA74DB-046A-4623-98C3-A4334859895C&format=JSON')
            .then((res)=>{
                this.weatherData = res.data.records.locations[0].location
                // console.log(this.weatherData)
                this.targetArea = this.weatherData.find(item=>item.locationName==name)

                this.rain = this.targetArea.weatherElement[0].time[1].elementValue[0].value
                this.weather = this.targetArea.weatherElement[1].time[1].elementValue[0].value
                this.temperature = this.targetArea.weatherElement[2].time[1].elementValue[0].value
            })
        }
      

    },
 
    mounted() {
        this.initMap()
    },
    created() {
        this.getFavouriteInfo()
  
    },
}).mount("#app")