"""
@author: Juan Sebastian Becerra Barcenas

algoritmo financiero que usa un pipe personalizado con Qstockstradable



bibliografia:
http://www.zipline.io/appendix.html#zipline.assets.Asset
https://www.youtube.com/watch?v=RHmiBA50BN0
https://www.quantopian.com/posts/using-a-specific-list-of-securities-in-pipeline
https://www.quantopian.com/posts/introducing-the-pipeline-api
https://www.youtube.com/watch?v=IKofcJ0jXjA&list=PLRFLF1OxMm_WUX97SE1HwQQIpkcWLVCvB
https://www.quantopian.com/lectures/example-long-short-equity-algorithm

"""



from quantopian.algorithm import attach_pipeline, pipeline_output
from quantopian.pipeline.data.builtin import USEquityPricing
from quantopian.pipeline.factors import AverageDollarVolume
from quantopian.pipeline import Pipeline, CustomFilter
from quantopian.pipeline.factors import Latest
from quantopian.pipeline.filters import QTradableStocksUS
from quantopian.pipeline.experimental import risk_loading_pipeline

import quantopian.algorithm as algo
import numpy as np
import quantopian.optimize as opt


MAX_GROSS_LEVERAGE = 1.0
TOTAL_POSITIONS = 600
MAX_SHORT_POSITION_SIZE = 2.0 / TOTAL_POSITIONS
MAX_LONG_POSITION_SIZE = 2.0 / TOTAL_POSITIONS

"""
funcion donde se inicializan todas las varibles y funciones organizadoras
"""
def initialize(context):

   
    algo.schedule_function(rebalance,algo.date_rules.week_start(), time_rules.market_open())
    
    algo.schedule_function(recordo,date_rules.every_day(), time_rules.market_close())
    
    algo.attach_pipeline(make_pipeline(), 'my_pipeline')
    algo.attach_pipeline(risk_loading_pipeline(), 'risk_factors')
    
"""
Funcion que crea el pipe con QtradableStock, a su vez les obtiene su mejor precio, peor precio y la diferencia entre ambos
"""
def make_pipeline():
    
    universe= QTradableStocksUS()
    
    

    high = Latest(
            inputs=[USEquityPricing.high],
            mask = universe,
            )    
    low = Latest(
            inputs=[USEquityPricing.low],
            mask = universe,
            )
    diference =high-low
    pipe = Pipeline(
            columns = {
                   'high' : high,
                   'low'  : low,
                   'diference': diference,
                    },
            screen=universe,
            )
    


    return pipe

"""
funcion que antes de empezar a hacer los negocios indica cual es el pipeline con el que se va a trabajar (el que se creo anteriormente)
"""
def before_trading_start(context,data):
    context.output= algo.pipeline_output('my_pipeline')
    context.risk_loadings = algo.pipeline_output('risk_factors')
    context.lista_segura=context.output.index
    
"""
funcion que maneja el portafolio, se inicia apenas se abre el mercado (descrito en la funcion organizadora).
"""
   
def rebalance(context,data):
     prueba = context.output['diference']
     prueba_v= prueba.copy()
     prueba_v.sort()
     risk_loadings = context.risk_loadings
    
     objective = opt.MaximizeAlpha(prueba_v)
     
     constraints = []
    
     constraints.append(opt.MaxGrossExposure(MAX_GROSS_LEVERAGE))

    
     constraints.append(opt.DollarNeutral())

    
     neutralize_risk_factors = opt.experimental.RiskModelExposure(
        risk_model_loadings=risk_loadings,
        version=0
    )
     constraints.append(neutralize_risk_factors)
     


     constraints.append(
        opt.PositionConcentration.with_equal_bounds(
            min=-MAX_SHORT_POSITION_SIZE,
            max=MAX_LONG_POSITION_SIZE
        ))
     algo.order_optimal_portfolio(
        objective=objective,
        constraints=constraints
    )
  
 
"""
funcion que grafica al final de cada día las estadisticas diaras, de cuantas veces se endeudo, cuantas veces compro y cuantas vendio
"""
def recordo(context, data):
    irse_largo = irse_corto = 0
    for position in context.portfolio.positions.itervalues():
        if position.amount>0:
            irse_largo+=1
        elif position.amount<0:
            irse_corto+=1
        record(apalancarse=context.account.leverage, largo=irse_largo, cort=irse_corto)
