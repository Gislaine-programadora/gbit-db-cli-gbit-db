class Operators {


    static eq(value){

        return item => item === value;

    }



    static neq(value){

        return item => item !== value;

    }



    static gt(value){

        return item => item > value;

    }



    static gte(value){

        return item => item >= value;

    }



    static lt(value){

        return item => item < value;

    }



    static lte(value){

        return item => item <= value;

    }



    static contains(value){

        return item =>
            String(item)
            .includes(value);

    }



    static in(values){

        return item =>
            values.includes(item);

    }


}



export default Operators;