const LANGUAGE_DATA: Record<string, any> = {
	'pt-BR': {
		name: 'Português',
		menuNewGame: 'Novo jogo',
		menuShowSolution: 'Mostrar solução',
		menuHowToPlay: 'Como jogar',
		modalWinTitle: 'Vitória',
		modalLoseTitle: 'Derrota',
		modalWinText: 'Você decifrou o código!',
		modalLoseText: <>Você não conseguiu<br />decifrar o código.'</>,
		modalHowToPlay: <><p>O objetivo é descobrir a combinação de cores. Cada uma das tentativas é analisada da seguinte forma:</p><ul><li>Um pino cinza indica que um dos pinos é da cor correta e está na posição correta;</li><li>Um pino branco indica que um dos pinos é da cor correta, mas está na posição errada;</li><li>Um espaço vazio indica que uma das cores não faz parte da solução.</li></ul></>
	},
	'en': {
		name: 'English',
		menuNewGame: 'New game',
		menuShowSolution: 'Show solution',
		menuHowToPlay: 'How to play',
		modalWinTitle: 'Victory',
		modalLoseTitle: 'Defeat',
		modalWinText: "You've cracked the code!",
		modalLoseText: <>You've failed<br />to crack the code."</>,
		modalHowToPlay: <><p>The goal is to discover the colour sequence. Each attempt is analysed thusly:</p><ul><li>A grey pin shows a pin is the right colour and is in the right position;</li><li>A white pin shows a pin is the right colour, but is in the wrong position;</li><li>A blank space means one of the colours is not part of the solution.</li></ul></>
	}
};

export interface Language {
	shortName: string;
	name: string;
}

export const getLanguages = (): Array<Language> => {
	const result = Object.keys(LANGUAGE_DATA).map(key => {
		return {
			shortName: key,
			name: LANGUAGE_DATA[key]['name']
		}
	});
	return result;
};

export const getLanguageData = (lang: Language) => {
	return LANGUAGE_DATA[lang.shortName];
}