# About
The Peloton web application does not display target metrics, like cadance and resistance. This bookmarklet uses the Peloton web application and API to display the target metrics. Works in cycling classes only.

![Alt](https://raw.githubusercontent.com/RaVbaker/peloton_renpho_metrics/master/docs/preview.png "Peloton class with target metrics")

# Metrics
- Two resistance ranges are displayed. The first is for the Schwinn ic4 bike, the second is for Peloton (in paranthesis).
- Live and recently added classes do not have metrics. It can take a day or more for Peloton to add metrics to a recording.
- Metrics begin after the 1 minute warm-up.

# How to use
1. Start a cycling class on the Peloton website.
2. Open the PelotonSchwinn bookmark.
3. Metrics are magically displayed! (after the one minute start/warm-up)

# How to install
Go to https://zv3zrmct.github.io/peloton_schwinn_metrics/.

# Source of resistance ranges

I've found two sources which explained resistance on Peloton and empirically checked on my own bike. Therefore the values can be a bit skewed but should serve as good enough for start. 

I've discovred I couldn't get more output in watt than 360W. Which matches what [Amazon product page](https://www.amazon.com/RENPHO-AI-Powered-Exercise-Resistance-Stationary/dp/B08JCLKHHW) stands about:  Male 371W, Female 313W as power range.

One source was a [peloton reddit thread](https://www.reddit.com/r/pelotoncycle/wiki/index/resistancechart/) where I've found a table:


| Cadence |	Resistance |	Expected Output |
|-----|----|--------------|
| 100 |	30 |	88-92 |
| 100 |	35 |	120-125 |
| 100 |	40 |	160-165 |
| 100 |	45 |	215-220 |
| 100 |	50 |	260-265 |
 
| Cadence |	Resistance |	Expected Output |
|-----|----|-----------|
| 80 |	30 |	58-62 |
| 80 |	35 |	83-85 |
| 80 |	40 |	111-115 |
| 80 |	45 |	143-146 |
| 80 |	50 |	186-190 |

Second source was a blog post by [lamberts lately](https://www.lambertslately.com/how-to-convert-peloton-resistance-schwinn-ic4) with [this breakdown](https://www.lambertslately.com/wp-content/uploads/2021/03/yi_peloton_schwinn.pdf) that originated from Schwinn IC4 Facebook page.

Numbers I figured out for **Renpho AI Smart bike** are as follows:

| Renpho Bike Resistance | Peloton Resistance |
|------------------------|--------------------|
| 2,5 | 10 |
| 4 | 20 |
| 7 | 30 |
| 10 | 35 |
| 14 | 40 |
| 17,5 | 45 |
| 22,5 | 50 |
| 29 | 55 |
| 36,5 | 60 |
| 40 | 63 |

(c) RaVbaker 2022