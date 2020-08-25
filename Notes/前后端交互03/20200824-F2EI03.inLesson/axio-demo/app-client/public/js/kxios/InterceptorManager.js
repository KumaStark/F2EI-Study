class InterceptorManager {

    constructor() {

        //this.handlers = [ {fulfilled:s1, rejected:e1}, {fulfilled:s2, rejected:e2} ]

        this.handlers = [];
    }

    // addEventListener
    use(fulfilled, rejected) {
        this.handlers.push({
            fulfilled,
            rejected
        });
    }

}


export default InterceptorManager;