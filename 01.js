Vue.createApp({
    data() {
        return {
            travelData: [],
            travelInfo: [],
            travelArea: '',
            AreaName: [],
            idNumMin: 0,
            idNumMax: 10,
            myFavorite: [],
            currentPage: 1,
            extraPage: [],
            extraPage_min: -3,
            extraPage_max: 8,
            favorite: [],
        }
    },
    methods: {
        getTravelinformation() {
            axios.get("./json/info.json")
                .then((res) => {
                    this.travelData = res.data
                    this.travelInfo = res.data

                    // console.log(this.travelData)

                    this.travelData = this.travelData.slice(this.idNumMin, this.idNumMax)

                })
        },
        getAreaName() {
            axios.get("./json/area.json")
                .then((res) => {
                    this.AreaName = res.data[0].AreaList
                })
        },

        chosePage(i) {
            this.currentPage = i
            this.idNumMin = i * 10
            this.idNumMax = 10 + i * 10


            this.extraPage_min = this.extraPage_min + i - this.extraPage_min
            this.extraPage_max = this.extraPage_min + 8

            console.log("min", this.extraPage_min)
            console.log("max", this.extraPage_max)


            this.getTravelinformation()
        },
        addFavorite(id) {
            let sameTravel = this.favorite.find(item => item.id === id)

            let index = this.travelData.findIndex(item => item.id === id)


            if (!sameTravel) {
                alert("新增成功")
                this.favorite.push({
                    id: id,
                    district: this.travelData[index].district,
                    name: this.travelData[index].name,
                    address: this.travelData[index].address,
                    lat: this.travelData[index].lat,
                    long: this.travelData[index].long

                })
            } else {
                alert("已加入過最愛")
            }
            this.setLocalStorage();
        },
        addTotal() {
            let sameTravel = this.favorite.find(v=>this.myFavorite.find(u=>v.id===u.id))

            if (!sameTravel) {
              alert("新增成功")
                for (let i = 0; i < this.myFavorite.length; i++) {
                   
                    this.favorite.push({
                        id: this.myFavorite[i].id,
                        district: this.myFavorite[i].district,
                        name: this.myFavorite[i].name,
                        address: this.myFavorite[i].address,
                        lat: this.myFavorite[i].lat,
                        long: this.myFavorite[i].long

                    })
                }
                this.setLocalStorage()
               this.myFavorite=[]
             
            } else {
                alert("已加入我的最愛")
            }
        },
        setLocalStorage() {
            localStorage.setItem("myFavorite", JSON.stringify(this.favorite))
        },
    },
    computed: {
        travelDataLength() {
            return Math.ceil(this.travelInfo.length / 10)
        },
    },
    watch: {
        travelArea() {
            this.travelData = this.travelInfo.filter(item => item.district === this.travelArea)
        },
    },
    created() {
        this.getTravelinformation()
        this.getAreaName()
    }
}).mount("#app")
