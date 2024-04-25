const TOKEN = 'patkzoJKWr6uW1Vz6.798a6e3220084a567b478ef44e0c151b5391bfdc6b8612994b52e14557543d69';
const BASE = 'appmcm2fjasLa7UMc';

export default class AirtableHandler {
	static getLanguages(onFetch: (data: Array<Object>) => void) {
		fetch(`https://api.airtable.com/v0/${BASE}/Projects?view=Codebreaker&filterByFormula=({name}='languages')`,
			{
				headers: {
					"Authorization": `Bearer ${TOKEN}`,
					"Content-Type": "application/json;charset=UTF-8"
				}
			})
			.then(res => res.json())
			.then(data => {
				const languages = data.records[0].fields.key.split(',');
				const result = languages.map((language: string) => {
					const parts = language.split('||');
					return {
						shortName: parts[0],
						name: parts[1]
					};
				});
				if (typeof onFetch === 'function') onFetch(result);
			})
	}

	static getLanguageData(lang: string, onFetch: (data: any) => void) {
		fetch(`https://api.airtable.com/v0/${BASE}/Projects?view=Codebreaker&filterByFormula=({name}='lang')`,
			{
				headers: {
					"Authorization": `Bearer ${TOKEN}`,
					"Content-Type": "application/json;charset=UTF-8"
				}
			})
			.then(res => res.json())
			.then(data => {
				const result: { [k: string]: any } = {};
				data.records.forEach((record: any) => {
					result[record.fields.key] = record.fields[lang]
				});
				if (typeof onFetch === 'function') onFetch(result);
			})
	}
}