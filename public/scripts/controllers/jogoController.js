/**
 * Created by Osvaldo & Gustavo on 23/09/15.
 *
 * O melhor resultado é definide pelo somatorio do custo(custo dos movementos para  chegar na posição final)
 * mais o custo estimado que é o somatorio da distancia da peça até sua posição final mais a distancia da
 * peça vazia até a peça atual se ela não estiver em sua posição final.
 */

app.controller("jogoController",['$scope', function ($scope) {

    $scope.verificaValido = function(){
        $scope.jogadasVerificadas = [];
        $scope.possiveisJogadas = [];
        $scope.menorCaminho = [];
        me.numerosEscolhidos = [];
        $scope.um = 1;

        var posicaoEscolhida = angular.copy($scope.posicaoAtual);

        for(var index in me.estadoFinal){
            me.verificaNumerosEscolhidos(me.estadoFinal[index]);
        }

        if(me.numerosEscolhidos.length == 9){

            me.primeiro = {
                estado: posicaoEscolhida,
                custoEstimado: 0,
                custo: 0,
                pai: ""
            };

            me.calcCustoEstimado(posicaoEscolhida, function(ret){

                me.primeiro.custoEstimado = ret;

                $scope.possiveisJogadas.push(me.primeiro);

                console.log("heuristica", me.primeiro);

                me.calculaCaminho();
            });


        }


    };

}]);