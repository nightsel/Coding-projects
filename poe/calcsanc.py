import numpy as np

import random as rd
import math

#The most complicated strategy collects coins and purchases items during the
#game from merchants. The goal is to buy as many items called "relics" from the
#shop as possible by the 4th merchant. Some relics are much better than others,
#such as one that gives a discount to every other purchase, which is why you
#have to be picky in the beginning.

#The items that sanctum is started with make it easier for you to be able to
#purchase everything. Particularly one makes all of your purchases cheaper, and
#one gives you more offered options on every merchant. Based on the economy,
#where the starting items are priced, most of the
#players believe that getting more choices is better even if you don't get any
#cost reduction but with the script calcsanc.py I simulated that it's not the
#case. Balancing cost reductions and increasing merchants' offered options is a better
#option than only increasing merchants' offered options.

#Takeaways: Best balance at 8 choices 28% reduction. Better than 7 choices and 35% reduction. 5% reduction 1 merchant is bettter than 2 merchant choices.

lengt = 32 # total boons is 32, maybe reduce by 1 if assuming 1 from pacts
deft = 3
choices = 8

prices = [220, 280, 320, 420]
itamount = 5000 #iteration amount
coinstart = 500 #how much coins gained from chests/mobs before each merchant
extracoins = 0 # how much coins gained from other sources like relics before each merchant

relsatend0 = []
relsatend = []

relsatend2 = []
relsatend3 = []
coinsatend = []
coinsatend2 = []
cointhresholdcheap = 800 #optimal amount of coins to buy worthless relics that are cheap if merchants are back to back with no coins between
cointhresholdmedium = 1000 #not used

for iters in range(itamount):
    choicestart = choices
    coins = coinstart + extracoins

    rels = np.zeros(lengt)
    multi = .7


    for i in range(lengt):
            rels[i] = i
    currentrels = rels

    rd.seed()
    # find merchant 1

    relchoices = []

    while len(relchoices) < min(deft+choicestart, np.size(currentrels)):
        num1 = math.floor(rd.random() * lengt)
        #print(((np.array(np.where(rels == num1)))))
        indices = np.where(rels == num1)[0]

        # Check if indices array is not empty
        if indices.size > 0:
            relchoices.append(num1)
            rels = np.delete(rels, indices[0])
    #print(rels)
    #print(currentrels)
    list(reversed(relchoices))
    relchoices = np.array(relchoices)
    relchoices = np.sort(relchoices)
    relchoices = relchoices[::-1]
    #print(type(relchoices))
    if 0 in relchoices:
        relprice = math.ceil(multi*prices[math.floor(rd.random() * 4)])
        coins = coins-relprice
        multi = multi-0.5
        currentrels = np.delete(currentrels, np.where(currentrels == 0))
        relchoices = np.delete(relchoices, np.where(relchoices == 0))
        #print('found')
    if 1 in relchoices:
        relprice = math.ceil(multi*prices[math.floor(rd.random() * 4)])
        coins = coins-relprice
        if multi > 0.5:
            newmult = math.floor(1.3*(1-multi)*100)/100
            multi = 1-newmult
        else:
            multi = multi+0.5
            newmult = math.floor(1.3*(1-multi)*100)/100
            multi = 1-newmult-0.5
        choicestart = math.floor(choicestart*1.3)
        currentrels = np.delete(currentrels, np.where(currentrels == 1))
        relchoices = np.delete(relchoices, np.where(relchoices == 1))

    pricesofrelics = []
    for s in relchoices:
        price = math.ceil(multi * prices[math.floor(rd.random() * 4)])
        pricesofrelics.append(price)

    pricesofrelics = np.array(pricesofrelics)


    if multi > 0.4:
        # buy only relics that costed 220 originally

        indicestest = relchoices[np.where(pricesofrelics == math.ceil(220*multi))]

        # Remove the corresponding relics from currentrels
        #for index in sorted(indices_to_remove, reverse=True):
        for r in indicestest:
            if coins - math.ceil(220*multi) >= 0 and coins > cointhresholdcheap:
                currentrels = np.delete(currentrels, np.where(r == currentrels))
                coins = coins - math.ceil(220*multi)


    else:
        # buy relics in order of cheapest first until reaching 0 coins
        for s in range(100):
            if pricesofrelics.any():
                buyindices = np.where(np.min(pricesofrelics)==pricesofrelics)

                if coins - np.min(pricesofrelics) >= 0:
                    for oneindex in np.sort(buyindices[0])[::-1]:
                        if coins - np.min(pricesofrelics) >= 0:
                            coins = coins - np.min(pricesofrelics)
                            pricesofrelics = np.delete(pricesofrelics, oneindex)
                            currentrels = np.delete(currentrels, np.where(relchoices[oneindex] == currentrels))
                            relchoices = np.delete(relchoices, np.where(relchoices[oneindex] == relchoices))
                else:
                    break
            else:
                break

    relsatend0.append(lengt-np.size(currentrels))
    #print('coins')
    #print(coins)
    rels = currentrels
    #print(currentrels)
    #print(multi)



    coins = coins + coinstart + extracoins
    #find merchant 2

    relchoices = []

    while len(relchoices) < min(deft+choicestart, np.size(currentrels)):
        num1 = math.floor(rd.random() * lengt)
        #print(((np.array(np.where(rels == num1)))))
        indices = np.where(rels == num1)[0]

        # Check if indices array is not empty
        if indices.size > 0:
            relchoices.append(num1)
            rels = np.delete(rels, indices[0])
    #print(rels)
    #print(currentrels)
    list(reversed(relchoices))
    relchoices = np.array(relchoices)
    relchoices = np.sort(relchoices)
    relchoices = relchoices[::-1]

    #relchoices work well


    #print(type(relchoices))
    if 0 in relchoices:
        relprice = math.ceil(multi*prices[math.floor(rd.random() * 4)])
        coins = coins-relprice
        multi = multi-0.5
        currentrels = np.delete(currentrels, np.where(currentrels == 0))
        relchoices = np.delete(relchoices, np.where(relchoices == 0))
        #print('found')
    if 1 in relchoices:
        relprice = math.ceil(multi*prices[math.floor(rd.random() * 4)])
        coins = coins-relprice
        if multi > 0.5:
            newmult = math.floor(1.3*(1-multi)*100)/100
            multi = 1-newmult
        else:
            multi = multi+0.5
            newmult = math.floor(1.3*(1-multi)*100)/100
            multi = 1-newmult-0.5
        choicestart = math.floor(choicestart*1.3)
        currentrels = np.delete(currentrels, np.where(currentrels == 1))
        relchoices = np.delete(relchoices, np.where(relchoices == 1))

    pricesofrelics = []
    for s in relchoices:
        price = math.ceil(multi * prices[math.floor(rd.random() * 4)])
        pricesofrelics.append(price)

    pricesofrelics = np.array(pricesofrelics)



    if multi > 0.4:
        # buy only relics that costed 220 originally

        indicestest = relchoices[np.where(pricesofrelics == math.ceil(220*multi))]

        # Remove the corresponding relics from currentrels
        #for index in sorted(indices_to_remove, reverse=True):
        for r in indicestest:
            if coins - math.ceil(220*multi) >= 0:
                currentrels = np.delete(currentrels, np.where(r == currentrels))
                coins = coins - math.ceil(220*multi)


    else:
        # buy relics in order of cheapest first until reaching 0 coins
        for s in range(100):
            if pricesofrelics.any():
                buyindices = np.where(np.min(pricesofrelics)==pricesofrelics)

                if coins - np.min(pricesofrelics) >= 0:
                    for oneindex in np.sort(buyindices[0])[::-1]:
                        if coins - np.min(pricesofrelics) >= 0:
                            coins = coins - np.min(pricesofrelics)
                            pricesofrelics = np.delete(pricesofrelics, oneindex) # this works well
                            currentrels = np.delete(currentrels, np.where(relchoices[oneindex] == currentrels)) # this doesnt work i assume
                            relchoices = np.delete(relchoices, np.where(relchoices[oneindex] == relchoices))


                else:
                    break
            else:
                break


    relsatend.append(lengt-np.size(currentrels))
    coinsatend.append(coins)



    rels = currentrels
    #print(currentrels)
    #print(multi)



    coins = coins + coinstart + extracoins
    #find merchant 2

    relchoices = []

    while len(relchoices) < min(deft+choicestart, np.size(currentrels)):
        num1 = math.floor(rd.random() * lengt)
        #print(((np.array(np.where(rels == num1)))))
        indices = np.where(rels == num1)[0]

        # Check if indices array is not empty
        if indices.size > 0:
            relchoices.append(num1)
            rels = np.delete(rels, indices[0])
    #print(rels)
    #print(currentrels)
    list(reversed(relchoices))
    relchoices = np.array(relchoices)
    relchoices = np.sort(relchoices)
    relchoices = relchoices[::-1]

    #relchoices work well


    #print(type(relchoices))
    if 0 in relchoices:
        relprice = math.ceil(multi*prices[math.floor(rd.random() * 4)])
        coins = coins-relprice
        multi = multi-0.5
        currentrels = np.delete(currentrels, np.where(currentrels == 0))
        relchoices = np.delete(relchoices, np.where(relchoices == 0))
        #print('found')
    if 1 in relchoices:
        relprice = math.ceil(multi*prices[math.floor(rd.random() * 4)])
        coins = coins-relprice
        if multi > 0.5:
            newmult = math.floor(1.3*(1-multi)*100)/100
            multi = 1-newmult
        else:
            multi = multi+0.5
            newmult = math.floor(1.3*(1-multi)*100)/100
            multi = 1-newmult-0.5
        choicestart = math.floor(choicestart*1.3)
        currentrels = np.delete(currentrels, np.where(currentrels == 1))
        relchoices = np.delete(relchoices, np.where(relchoices == 1))

    pricesofrelics = []
    for s in relchoices:
        price = math.ceil(multi * prices[math.floor(rd.random() * 4)])
        pricesofrelics.append(price)

    pricesofrelics = np.array(pricesofrelics)



    if multi > 0.4:
        # buy only relics that costed 220 originally

        indicestest = relchoices[np.where(pricesofrelics == math.ceil(220*multi))]

        # Remove the corresponding relics from currentrels
        #for index in sorted(indices_to_remove, reverse=True):
        for r in indicestest:
            if coins - math.ceil(220*multi) >= 0:
                currentrels = np.delete(currentrels, np.where(r == currentrels))
                coins = coins - math.ceil(220*multi)


    else:
        # buy relics in order of cheapest first until reaching 0 coins
        for s in range(100):
            if pricesofrelics.any():
                buyindices = np.where(np.min(pricesofrelics)==pricesofrelics)

                if coins - np.min(pricesofrelics) >= 0:
                    for oneindex in np.sort(buyindices[0])[::-1]:
                        if coins - np.min(pricesofrelics) >= 0:
                            coins = coins - np.min(pricesofrelics)
                            pricesofrelics = np.delete(pricesofrelics, oneindex) # this works well
                            currentrels = np.delete(currentrels, np.where(relchoices[oneindex] == currentrels)) # this doesnt work i assume
                            relchoices = np.delete(relchoices, np.where(relchoices[oneindex] == relchoices))


                else:
                    break
            else:
                break


    relsatend2.append(lengt-np.size(currentrels))
    coinsatend2.append(coins)
    rels = currentrels
    #print(currentrels)
    #print(multi)



    coins = coins + coinstart + extracoins
    #find merchant 2

    relchoices = []

    while len(relchoices) < min(deft+choicestart, np.size(currentrels)):
        num1 = math.floor(rd.random() * lengt)
        #print(((np.array(np.where(rels == num1)))))
        indices = np.where(rels == num1)[0]

        # Check if indices array is not empty
        if indices.size > 0:
            relchoices.append(num1)
            rels = np.delete(rels, indices[0])
    #print(rels)
    #print(currentrels)
    list(reversed(relchoices))
    relchoices = np.array(relchoices)
    relchoices = np.sort(relchoices)
    relchoices = relchoices[::-1]

    #relchoices work well


    #print(type(relchoices))
    if 0 in relchoices:
        relprice = math.ceil(multi*prices[math.floor(rd.random() * 4)])
        coins = coins-relprice
        multi = multi-0.5
        currentrels = np.delete(currentrels, np.where(currentrels == 0))
        relchoices = np.delete(relchoices, np.where(relchoices == 0))
        #print('found')
    if 1 in relchoices:
        relprice = math.ceil(multi*prices[math.floor(rd.random() * 4)])
        coins = coins-relprice
        if multi > 0.5:
            newmult = math.floor(1.3*(1-multi)*100)/100
            multi = 1-newmult
        else:
            multi = multi+0.5
            newmult = math.floor(1.3*(1-multi)*100)/100
            multi = 1-newmult-0.5
        choicestart = math.floor(choicestart*1.3)
        currentrels = np.delete(currentrels, np.where(currentrels == 1))
        relchoices = np.delete(relchoices, np.where(relchoices == 1))

    pricesofrelics = []
    for s in relchoices:
        price = math.ceil(multi * prices[math.floor(rd.random() * 4)])
        pricesofrelics.append(price)

    pricesofrelics = np.array(pricesofrelics)



    if multi > 0.4:
        # buy only relics that costed 220 originally

        indicestest = relchoices[np.where(pricesofrelics == math.ceil(220*multi))]

        # Remove the corresponding relics from currentrels
        #for index in sorted(indices_to_remove, reverse=True):
        for r in indicestest:
            if coins - math.ceil(220*multi) >= 0:
                currentrels = np.delete(currentrels, np.where(r == currentrels))
                coins = coins - math.ceil(220*multi)


    else:
        # buy relics in order of cheapest first until reaching 0 coins
        for s in range(100):
            if pricesofrelics.any():
                buyindices = np.where(np.min(pricesofrelics)==pricesofrelics)

                if coins - np.min(pricesofrelics) >= 0:
                    for oneindex in np.sort(buyindices[0])[::-1]:
                        if coins - np.min(pricesofrelics) >= 0:
                            coins = coins - np.min(pricesofrelics)
                            pricesofrelics = np.delete(pricesofrelics, oneindex) # this works well
                            currentrels = np.delete(currentrels, np.where(relchoices[oneindex] == currentrels)) # this doesnt work i assume
                            relchoices = np.delete(relchoices, np.where(relchoices[oneindex] == relchoices))


                else:
                    break
            else:
                break


    relsatend3.append(lengt-np.size(currentrels))

print('rels after 1')
print(sum(relsatend0)/len(relsatend0))
print('rels after 2')
print(sum(relsatend)/len(relsatend))
print(sum(coinsatend)/len(relsatend))
print('relics after 3')
print(sum(relsatend2)/len(relsatend2))
print(sum(coinsatend2)/len(relsatend2))
print('relics after 4')
print(sum(relsatend3)/len(relsatend3))
