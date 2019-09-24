export const queryableLogger = (error: any): void => {
    if (error) {
        console.log('Error' + error);
        return;
    }
};
