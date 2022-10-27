Vue.createApp({
    data() {
        return {
            travelData: [],
            travelInfo: [],
            travelArea: '',
            travelSearch: '',
            AreaName: [],
            idNumMin: 0,
            idNumMax: 10,
            myFavorite: [],
            currentPage: 1,
            extraPage: [],
            pageShow: 8,
            favorite: [],
            showList: false,
            totalPages:55,
        }
    },
    methods: {
        getTravelinformation() {
            this.travelData = []
            axios.get("./json/info.json")
                .then((res) => {
                    this.travelData = res.data
                    this.travelInfo = res.data


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
            this.getTravelinformation()
            this.updatePage()
        },
        updatePage() {

            let start = 1
            let end = start + this.pageShowCount
            if (this.currentPage > this.pageShowCount) {
                start = this.currentPage - 3
                end = start + 7
            }
            if (this.totalPages > this.pageShowCount && this.currentPage >= this.totalPages - 1) {
                end = this.totalPages,
                    start = this.currentPage - 4
            }
            this.extraPage = []
            for (let index = start; index <= end; index++) {
                if (index <= 54) {
                    this.extraPage.push(index)
                }
                this.extraPage = this.extraPage.slice(0, 8)

            }

        },
        prevPage() {
            if (this.currentPage > 0) {
                this.currentPage -= 1
                this.idNumMin = this.currentPage * 10
                this.idNumMax = 10 + this.currentPage * 10
                this.getTravelinformation()
                this.updatePage()
            }
        },
        nextPage() {
            if (this.currentPage < 55) {
                this.currentPage += 1
                this.idNumMin = this.currentPage * 10
                this.idNumMax = 10 + this.currentPage * 10
                this.getTravelinformation()
                this.updatePage()
            }
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
                    tel: this.travelData[index].tel,
                    lat: this.travelData[index].lat,
                    long: this.travelData[index].long

                })
            } else {
                alert("已加入過最愛")
            }
            this.setLocalStorage();
        },
        addTotal() {
            let sameTravel = this.favorite.find(v => this.myFavorite.find(u => v.id === u.id))

            if (!sameTravel) {
                alert("新增成功")
                for (let i = 0; i < this.myFavorite.length; i++) {

                    this.favorite.push({
                        id: this.myFavorite[i].id,
                        district: this.myFavorite[i].district,
                        name: this.myFavorite[i].name,
                        address: this.myFavorite[i].address,
                        tel: this.travelData[i].tel,
                        lat: this.myFavorite[i].lat,
                        long: this.myFavorite[i].long

                    })
                }
                this.setLocalStorage()
                this.myFavorite = []

            } else {
                this.sameNumber = this.favorite.filter(v => this.myFavorite.find(u => v.id === u.id))

                for (let i = 0; i < this.sameNumber.length; i++) {
                    alert(`${this.sameNumber[i].name}已加入`)
                }

            }
        },
        keyWordSearch() {
            this.travelData = this.travelInfo.filter(item => item.name == this.travelSearch ||
                item.district == this.travelSearch)
        },
        setLocalStorage() {
            localStorage.setItem("myFavorite", JSON.stringify(this.favorite))
        },
        getFavouriteInfo() {
            let favouriteInfo = localStorage.getItem("myFavorite");
            this.favorite = JSON.parse(favouriteInfo)

        },
    },
    computed: {
        travelDataLength() {
            return Math.ceil(this.travelInfo.length / 10)
        },
        pageShowCount() {
            if (this.totalPages <= this.pageShow) {
                return this.totalPages - 1
            } else {

                return this.pageShow - 1
            }
        },
    },
    watch: {
        travelArea() {
            this.travelData = this.travelInfo.filter(item => item.district === this.travelArea)
        },
        travelSearch: {
            handler(newVal) {
                if (newVal == "") {
                }
                this.travelData = this.travelInfo.slice(this.idNumMin, this.idNumMax)
            }
        },
    },
    created() {
        this.getTravelinformation()
        this.getAreaName()
        this.getFavouriteInfo()
        this.updatePage()
    },
    mounted() {
        
        this.totalPages = Math.ceil(this.travelInfo.length / 10)

        console.log(this.travelInfo)
    },
}).mount("#app")
