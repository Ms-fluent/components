export class Assert {
    public static isNotNull(value: any, message: string = 'A not null value is required') {
        if(value == null){
            throw new Error(message);
        }
    }

    public static isNotNullOrEmpty(value: string, message: string = 'A non empty string is required') {
        if(value == null || value === ''){
            throw new Error(message);
        }
    }

    public static isNotNullOrWhiteSpace(value: string, message: string = 'A non whitespace string is required') {
        if(value == null || value.trim() === ''){
            throw new Error(message);
        }
    }

    public static isPositive(value: number, message: string = ' The value must be a positive number'){
        if(value == null || value < 0){
            throw new Error(message);
        }
    }


    public static isNegative(value: number, message: string = ' The value must be a positive number'){
        if(value == null || value > 0){
            throw new Error(message);
        }
    }

    public static isInRange(value: number, range: [number, number],
                            message: string = `The value should be in the range [${range[0]}, ${range[1]}].`){
        Assert.isNotNull(range);
        Assert.isNotNull(value, message);
        if(value < range[0] || value > range[1]){
            throw new Error(message);
        }
    }
}
