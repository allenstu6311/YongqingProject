Vue.createApp({
    data() {
        return {
            travelData: [],
            travelInfo: [],
            travelArea: '1',
            travelSearch: '',
            AreaName: [],
            idNumMin: 0,
            idNumMax: 10,
            myFavorite: [],
            currentPage: 1,
            extraPage: [],
            pageShow: 8,
            showList: false,
            totalPages: 0,
            collect: [],
            judge: 0,
            dashed_1: 0,
            dashed_2: 0,
            totalFavitore: '',
            pageShowCount: 9,
            nothing:false
        }
    },
    methods: {
        getTravelinformation() {
            this.travelData=[]
            axios.get("https://run.mocky.io/v3/ad30da46-0b0a-4320-9a56-742b802e3f35")
                .then((res) => {
                    this.travelData = res.data
                    this.travelInfo = res.data
                    this.totalPages = Math.ceil(this.travelData.length / 10)
                    this.travelData = this.travelData.slice(this.idNumMin, this.idNumMax)
                    this.updatePage()
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
            this.idNumMax = i * 10
            this.idNumMin = this.idNumMax - 10
            if (this.judge == 0) {
                this.getTravelinformation()
            } else if (this.judge == 1) {

                this.filterArea()
            } else if (this.judge == 2) {
                this.keyWordSearch()
            }

        },
        updatePage() {
            let start = 1
            let end = start + this.pageShowCount
            if (this.currentPage > this.pageShowCount) {
                start = this.currentPage - 3
                end = start + 8
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
                this.dashed_2 = this.extraPage.length < 8
                this.dashed_1 = this.extraPage.includes(1)
       
            }

        },
        prevPage() {
            if (this.judge == 0) {
                if (this.currentPage > 1) {
                    this.currentPage-=1
                    this.idNumMax = this.currentPage * 10
                    this.idNumMin =   this.idNumMax  - 10
                    this.getTravelinformation()
                }
            } else if (this.judge == 1) {
             
                if (this.currentPage > 1) {
                    this.currentPage-=1
                    this.idNumMax = this.currentPage * 10
                    this.idNumMin =   this.idNumMax  - 10
                    this.filterArea()
                }
            } else if (this.judge == 2) {
                if (this.currentPage > 1) {
                       this.currentPage-=1
                       this.idNumMax = this.currentPage * 10
                       this.idNumMin =   this.idNumMax  - 10
                    this.keyWordSearch()
                }
            }

        },
        nextPage() {
         
            if (this.judge == 0) {
               
                if (this.currentPage < this.travelData.length) {
                    this.currentPage += 1
                    this.idNumMax = this.currentPage * 10
                    this.idNumMin =   this.idNumMax  - 10
                    this.getTravelinformation()
                }
            } else if (this.judge == 1) {
                if (this.currentPage <this.travelData.length) {
                    this.currentPage += 1
                    this.idNumMax = this.currentPage * 10
                    this.idNumMin =   this.idNumMax  - 10
                    this.filterArea()
                }
            } else if (this.judge == 2) {
                if (this.currentPage < Math.ceil(this.travelData.length / 10)) {
                    this.currentPage += 1
                    this.idNumMax = this.currentPage * 10
                    this.idNumMin =   this.idNumMax  - 10
                    this.keyWordSearch()
                }
            }
         

        },
        addFavorite(id) {
            let sameTravel = this.collect ? this.collect.find(item => item.id === id) : null
            let index = this.travelData.findIndex(item => item.id === id)

            if (this.collect && !sameTravel) {
                alert("新增成功")
                this.collect.push({
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
            let sameTravel = this.collect.find(v => this.myFavorite.find(u => v.id === u.id))

            if (!sameTravel) {
                alert("新增成功")
                for (let i = 0; i < this.myFavorite.length; i++) {

                    this.collect.push({
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
                this.sameNumber = this.collect.filter(v => this.myFavorite.find(u => v.id === u.id))
                let str = ''
                for (let i = 0; i < this.sameNumber.length; i++) {
                    str += `${this.sameNumber[i].name}  ,`
                }
                //alert(`${this.sameNumber[i].name}已加入`)
                alert(str + '已被加入')

            }
        },
        keyWordSearch() {
            this.judge = 2         
            this.travelData = this.travelInfo.filter(v=>v.name.includes(this.travelSearch))
            this.extraPage = []
            for (let i = 1; i < Math.ceil(this.travelData.length / 10); i++) {
                this.extraPage.push(i)
            }
            this.travelData = this.travelData.slice(this.idNumMin, this.idNumMax)
            if(this.travelData.length<1){
               this.nothing = true
            }

        },
        setLocalStorage() {
            localStorage.setItem("myFavorite", JSON.stringify(this.collect))
        },
        getFavouriteInfo() {
            let favouriteInfo = localStorage.getItem("myFavorite");

            if (!favouriteInfo) {
                return
            } else {
                this.collect = JSON.parse(favouriteInfo)
            }
        },
        filterArea() {
            if(this.travelArea!='1'){
                this.judge = 1
                this.travelData = this.travelInfo.filter(item => item.district === this.travelArea)
    
                this.extraPage = []
    
                for (let i = 1; i < Math.ceil(this.travelData.length / 10)+1 ; i++) {
                    this.extraPage.push(i)
                }
        
                this.travelData = this.travelData.slice(this.idNumMin, this.idNumMax)
                if (this.travelData.length == 0) {
                    this.idNumMin = 0
                    this.idNumMax = 10
                    this.currentPage = 1
                    this.filterArea()
                }
            }else{
                this.judge = 0
                this.travelData = this.travelInfo.slice(this.idNumMin, this.idNumMax)
                this.getTravelinformation()
            }
         
        },
        checkAll() {
            if (this.totalFavitore) {
                this.myFavorite = []

            } else {
                this.myFavorite = this.travelData
            }
        }
    },
    watch: {
        travelSearch: {
            handler(newVal) {
                if (newVal == "") {
                    this.nothing = false
                    this.judge=1
                    this.travelData = this.travelInfo.slice(this.idNumMin, this.idNumMax)
                    this.updatePage()
                }
            }
        },
        travelArea: {
            handler(newVal) {
                if (this.judge == 1) {
                    this.currentPage = 1
                    this.idNumMin = 0
                    this.idNumMax = 10
                    this.filterArea()
                }
            }
        },
        extraPage: {
            handler(newVal) {
                this.dashed_2 = newVal.length < 9
                this.dashed_1 = newVal.includes(1)
            }
        },
    },
    created() {
        this.getTravelinformation()
        this.getAreaName()
        this.getFavouriteInfo()
    },
}).mount("#app")
