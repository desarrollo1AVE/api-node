import formidable from 'formidable';
import fs from 'fs/promises';

class Utils {
	async loadFile(request, route, name, extension) {
		const form = formidable({ multiples: true, uploadDir: route });
		form.parse(request, (err, fields, files) => {
			if (err) {
				return {
					status: 'error'
				};
			} else {
				fs.rename(files[name].path, `${route}/${name}.${extension}`);
				return {
					status: 'ok'
				};
			}
		});
	}
}

export default Utils;
