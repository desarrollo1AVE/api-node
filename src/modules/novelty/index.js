import fileUpload from 'express-fileupload';

class Novelty {
	readFile(request) {
		if (!request) {
			return {
				status: 'error'
			};
		}else{
            return {
                status : "ok"
            }
        }
	}
}

export default Novelty;
