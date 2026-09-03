class Pagination {


    constructor(data=[]){


        this.data = data;


    }





    paginate(page=1,limit=10){


        const start =
            (page - 1) * limit;



        return {


            page,


            limit,


            total:
                this.data.length,


            pages:
                Math.ceil(
                    this.data.length / limit
                ),


            data:
                this.data.slice(
                    start,
                    start + limit
                )


        };


    }



}



export default Pagination;