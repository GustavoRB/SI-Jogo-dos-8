/**
 * Created by Osvaldo & Gustavo on 23/09/15.
 * 
 * O melhor resultado é definide pelo somatorio do custo(custo dos movementos para  chegar na posição final)
 * mais o custo estimado que é o somatorio da distancia da peça até sua posição final mais a distancia da
 * peça vazia até a peça atual se ela não estiver em sua posição final.
 */

app.controller("homeController",['$scope', function ($scope) {

	var me = this;

	me.estadoFinal = {
		00: "1",
		01: "2",
		02: "3",

		10: "8",
		11: "",
		12: "4",

		20: "7",
		21: "6",
		22: "5"
	};

	$scope.posicaoAtual = {
		00: "",
		01: "",
		02: "",

		10: "",
		11: "",
		12: "",

		20: "",
		21: "",
		22: ""
	};

	//jogadas que ja foram verificadas
	$scope.jogadasVerificadas = [];
	//jogadas da fronteira
	$scope.possiveisJogadas = [];
	//o melhor caminho para o resultado
	$scope.menorCaminho = [];

	//percorre a fronteira e verifica o elemento de menor custo
	me.calculaCaminho = function(){

		var menorCusto = $scope.possiveisJogadas[0].custo + $scope.possiveisJogadas[0].custoEstimado;
		var posicao = 0;

		console.log("fronteira", $scope.possiveisJogadas);

		for(var index in $scope.possiveisJogadas){
			var custoTotal = $scope.possiveisJogadas[index].custo + $scope.possiveisJogadas[index].custoEstimado;
			if(menorCusto > custoTotal){
				menorCusto = custoTotal;
				posicao = index;
			}
		}

		var ultimaJogada = $scope.possiveisJogadas[posicao];
		$scope.jogadasVerificadas.push($scope.possiveisJogadas[posicao]);
		$scope.possiveisJogadas.splice(posicao, 1);


		if(ultimaJogada.custoEstimado == 0){
			console.log('!fim');
			me.calcMenorCaminho(ultimaJogada);
		} else {
			console.log('proxima fronteira', ultimaJogada);
			// me.proximasJogadas(ultimaJogada);
		}
		
	};

	//calcula as proximas possiveis jogadas baseada na jogada de menor custo
	me.proximasJogadas = function(jogada){
		var coluna = 0;
		var linha = 0;

		var novaJogada = {}
		var novoEstado = {}


		for(var index in jogada.estado){
			console.log('passei por isso', index)
			if(jogada.estado[index] == ""){
				coluna = index%10;
				linha = (index - coluna)/10;

				console.log('o vazio esta aqui', index);

				if(coluna < 2){
					//o espaço vazio pode passar para a direita
					novoEstado = jogada.estado;
					novoEstado[index] = novoEstado[index+1];
					novoEstado[index+1] = "";

					novaJogada = {
						estado: novoEstado,
						custo: jogada.custo+1,
						pai: $scope.jogadasVerificadas.length-1
					};

					me.calcCustoEstimado(novoEstado, function(ret){
						novaJogada.custoEstimado = ret;
					});

					$scope.possiveisJogadas.push(novaJogada);
				}
				if(coluna > 0){
					//o espaço vazio pode passar para a esquerda
					novoEstado = jogada.estado;
					novoEstado[index] = novoEstado[index-1];
					novoEstado[index-1] = "";

					novaJogada = {
						estado: novoEstado,
						custo: jogada.custo+1,
						pai: $scope.jogadasVerificadas.length-1
					};

					me.calcCustoEstimado(novoEstado, function(ret){
						novaJogada.custoEstimado = ret;
					});

					$scope.possiveisJogadas.push(novaJogada);
				}
				if(linha < 2){
					//o espaço vazio pode passar para baixo
					novoEstado = jogada.estado;
					novoEstado[index] = novoEstado[index+10];
					novoEstado[index+10] = "";

					novaJogada = {
						estado: novoEstado,
						custo: jogada.custo+1,
						pai: $scope.jogadasVerificadas.length-1
					};

					me.calcCustoEstimado(novoEstado, function(ret){
						novaJogada.custoEstimado = ret;
					});

					$scope.possiveisJogadas.push(novaJogada);
				}
				if(linha > 0){
					//o espaço vazio pode passar para cima
										novoEstado = jogada.estado;
					novoEstado[index] = novoEstado[index-10];
					novoEstado[index-10] = "";

					novaJogada = {
						estado: novoEstado,
						custo: jogada.custo+1,
						pai: $scope.jogadasVerificadas.length-1
					};

					me.calcCustoEstimado(novoEstado, function(ret){
						novaJogada.custoEstimado = ret;
					});

					$scope.possiveisJogadas.push(novaJogada);
				}

			}
		}

		console.log('os novos possiveis', $scope.possiveisJogadas);

		//me.calculaCaminho();
	};

	//percorrer jogadasVerificadas para encontrar o menor caminho e salvar rota em menorCaminho
	me.calcMenorCaminho = function(jogadaFinal){
		//executar na interface

		var jogadaAnterior = jogadaFinal;
		for(var x = jogadaFinal.custo; x>=0; x++){
			$scope.menorCaminho.push(jogadaAnterior.estado);
			if(jogadaAnterior.pai == ""){
				break;
			}
			jogadaAnterior = $scope.jogadasVerificadas[jogadaAnterior.pai];
		}

		console.log($scope.menorCaminho);
	};

	//calcula custo estimado
	me.calcCustoEstimado = function(estado, callback){

		var colunaDesejada = 0;
		var linhaDesejada = 0;

		var colunaAtual = 0;
		var linhaAtual = 0;

		var colunaDoVazio = 0;
		var linhaDoVazio = 0;

		var custoTotal = 0;

		for(var index in estado){
			if(estado[index] == ""){
				colunaDoVazio = index%10;
				linhaDoVazio = (index - colunaDoVazio)/10;		
			}
		}

		for(var numero in me.estadoFinal){
			colunaDesejada = numero%10;
			linhaDesejada = (numero - colunaDesejada)/10;

			for(var index in estado){

				if(me.estadoFinal[numero] == estado[index] && numero != index){
					//calc do  num atual ate sua posicao final
					colunaAtual = index%10;
					linhaAtual = (index - colunaAtual)/10;

					custoTotal += Math.abs(colunaDesejada - colunaAtual);
					custoTotal += Math.abs(linhaDesejada - linhaAtual);

					//calc do elemento vazio ate num atual
					custoTotal += Math.abs(colunaAtual - colunaDoVazio);
					custoTotal += Math.abs(linhaAtual - linhaDoVazio);				
					
				}
			}
		}

		console.log('calculando', custoTotal);
		callback(custoTotal);
	};


	//-----------------------------------------VALIDADOR--------------------------------------------------
	me.numerosEscolhidos = [];

	//verifica se o numero necessario foi usado e salva em numerosEscolhidos
	me.verificaNumerosEscolhidos = function(numero){
		for(var index in $scope.posicaoAtual){
			if(numero == $scope.posicaoAtual[index]){
				me.numerosEscolhidos.push(numero);
				break;
			}
		}
	};

	//verifica se foi dada uma sequencia de numeros valida e começa a calcular caminho
	$scope.verificaValido = function(){
		$scope.jogadasVerificadas = [];
		$scope.possiveisJogadas = [];
		$scope.menorCaminho = [];
		me.numerosEscolhidos = [];
		for(var index in me.estadoFinal){
			me.verificaNumerosEscolhidos(me.estadoFinal[index]);
		}

		if(me.numerosEscolhidos.length == 9){

			me.primeiro = {
					estado: $scope.posicaoAtual,
					custoEstimado: 0,
					custo: 0,
					pai: ""
				};

			me.calcCustoEstimado($scope.posicaoAtual, function(ret){
				console.log(ret);
				me.primeiro.custoEstimado = ret;

				$scope.possiveisJogadas.push(me.primeiro);

				console.log('o primeiro', me.primeiro);
				
				console.log("numeros escolhidos", me.numerosEscolhidos);

				me.calculaCaminho();
			});


		}


	};
	//-------------------------------------------------------------------------------------------------------

}]);