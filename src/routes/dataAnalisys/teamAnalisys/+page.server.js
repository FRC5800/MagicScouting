
/** @type {import('./$types').PageServerLoad} */

import {GoogleGenerativeAI} from "@google/generative-ai";
import { GEMINI_API_KEY } from '$env/static/private';

export async function load() {
    
    //FALTA ADICIONAR A CHAVE DA API
    const ai = new GoogleGenerativeAI({GEMINI_API_KEY});
	const model = ai.getGenerativeModel({model: "gemini-1.5-flash"});


	//FALTA ADICIONAR UMA FORMA DE OBTER OS DADOS DA PLANILHA REFERENTES À EQUIPE DE ANÁLISE ATUAL
		try{
			// const prompt = `Os seguintes dados são observações de scouters de uma competição FRC sobre um robô: ${JSON.stringify(dadosPlanilha)} crie um resumo dos dados do robô com ao menos 3 dos seguintes pontos: Forças, Fraquezas, Inconsistências, Habilidade do Human Player`;
			const prompt = `Tell me FRC facts`;

			const result = await model.generateContent(prompt);
			const response = await result.response;
			const textoResumido = response.text();
			
			console.log(textoResumido);
            
			return textoResumido;
		}
		catch (e){

		console.error("Erro ao chamar IA: ", e)
		}
	
    return {
        texto: "Erro na geração da resposta"
    };
};