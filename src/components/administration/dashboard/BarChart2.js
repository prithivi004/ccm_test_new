import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
import {
    Container,
    Card,
    Form,
    Row,
    Col,
    Button,
    Image,
    DropdownButton,
    Dropdown,
    Spinner,
} from 'react-bootstrap';
import { BarOptions, BarOptions2 } from './ChartData'
import axiosInstance from '../../utils/axiosinstance'
import { DateFormat } from './../../utils/DateFormat'
import { DateFilter } from './../../utils/DateFilter'
import { CurrencyConvertor } from '../../utils/Calculator'

export class BarChart2 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: 'client',
            currency:'SGD',
            labels: [],
            country:'', 
            client:'',
        }
    }
    componentDidMount() {
        const { currency_list, user,currency,country, client } = this.props
        const month_list = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

        let total = []
        let received = []
        let remaining = []
        // let labels = month_list

        const month = new Date().getMonth()
        const year = (new Date().getFullYear())



        //akon_test


        axiosInstance.post(`/dashboard/chart_12`)
        .then(res=>{
            let chartData=[]
            let months=[]
            const chart_list = res.data.response.datas.reverse()   
            console.log(chart_list,'cl')
            const rk=chart_list.map((mk)=>{
                chartData.push(mk.chart_list)
                months.push(mk.month_name.substring(0,3).toUpperCase())
            })
            // console.log(chartData,'chartData')
            // console.log(months,'months')
            // // const myArray = [{x:100}, {x:200}, {x:300}];
            chartData.forEach((element, index, array) => {
                // console.log(element); // {x:100}
                const hk=CurrencyConvertor1(element)
                // console.log(hk,'hk')
                // console.log(index); // 0, 1, 2
                // console.log(array); // same myArray object 3 times           
                // console.log(data,'data')
                total.push(hk[user][0] !== '0.00' ? hk[user][0] : '')
                received.push(hk[user][1] !== '0.00' ? hk[user][1] : '')
                remaining.push(hk[user][2] !== '0.00' ? hk[user][2] : '')
            });
            this.setState({ user, total, received, remaining, labels:months, currency, currency_list,country, client })  
        })

       const CurrencyConvertor1 = (data) => {

            let client_total = 0
            let client_received = 0
            let client_remaining = 0
            let cont_total = 0
            let cont_paid = 0
            let cont_remaining = 0
            let margin = 0
        
           
                // console.log(data,"data")
                
                    client_total += parseFloat(data.total_client_issue_amount)
                    client_received += parseFloat(data.total_client_received_amount)
                    cont_total += parseFloat(data.total_cont_issue_amount)
                    cont_paid += parseFloat(data.total_cont_received_amount)
                    margin += parseFloat(data.total_margin_amount)
                
                    // console.log(currency_list[currency],"curreency")
               
           
        
            // marginlist !== undefined &&  marginlist.map(mar => {
            //     marginamt +=  parseFloat(mar.margin * (currency_list[currency] / currency_list[mar.currency]))
            // })
        
            client_remaining = client_total - client_received
            cont_remaining = cont_total - cont_paid
        
            // const margin = client_received - cont_paid
            // console.log(chart_list, client_total,client_received,client_remaining,cont_total,cont_paid,cont_remaining,'chart_list')
            return {
                client: [parseFloat(client_total).toFixed(2), parseFloat(client_received).toFixed(2), parseFloat(client_remaining).toFixed(2)],
                cont: [parseFloat(cont_total).toFixed(2), parseFloat(cont_paid).toFixed(2), parseFloat(cont_remaining).toFixed(2)],
                margin:parseFloat(margin).toFixed(2)
            }
        }

        // let promises = []
        // for (let i = month; i < month + 12; i++) {
        //     if (i < 11) {
        //         const from_date = DateFormat(new Date(year - 1, i + 1, 1))
        //         const to_date = DateFormat(new Date(year - 1, i + 2, 0))

        //         const data = { from_date, to_date }
        //         promises.push(axiosInstance.post(`/dashboard/chart`, data))
        //         labels.push(month_list[(i + 1)])

        //     } else {
        //         const from_date = DateFormat(new Date(year, i - 11, 1))
        //         const to_date = DateFormat(new Date(year, i - 10, 0))

        //         const data = { from_date, to_date }
        //         promises.push(axiosInstance.post(`/dashboard/chart`, data))
        //         labels.push(month_list[(i - 11)])
        //     }

        // }
        // Promise.all(promises).then(results => {
        //     // results.map(res => {
        //     //     const chart_list = res.data.response.chart_list
        //     //     // console.log(chart_list,'chartii')
        //     //     const data = CurrencyConvertor(currency, chart_list, currency_list)
        //     //     // console.log(data)
        //     //     total.push(data[user][0] !== '0.00' ? data[user][0] : '')
        //     //     received.push(data[user][1] !== '0.00' ? data[user][1] : '')
        //     //     remaining.push(data[user][2] !== '0.00' ? data[user][2] : '')
        //     // })
        //     // console.log(total, received, remaining, labels, 'barcartkguhuh')
        //     this.setState({  labels})
        // })
    }
    componentDidUpdate() {
        const { user, currency,country, client } = this.props
        const { currency_list,  } = this.state
        if (user !== this.state.user || currency !== this.state.currency ||country !== this.state.country || client !== this.state.client) {
            this.setState({ user, currency,country, client })
            // console.log('componentDidUpdate barchart')
            let total = []
            let received = []
            let remaining = []

            const month = new Date().getMonth()
            const year = (new Date().getFullYear())
    
            let promises = []
            for (let i = month; i < month + 12; i++) {
                if (i < 11) {
                    const from_date = DateFormat(new Date(year - 1, i + 1, 1))
                    const to_date = DateFormat(new Date(year - 1, i + 2, 0))
    
                    const data = { from_date, to_date, country_id: country !== '' ? parseInt(country) : '', client_id: client !== '' ? parseInt(client) : '', }
                    promises.push(axiosInstance.post(`/dashboard/chart`, data))
    
                } else {
                    const from_date = DateFormat(new Date(year, i - 11, 1))
                    const to_date = DateFormat(new Date(year, i - 10, 0))
    
                    const data = { from_date, to_date, country_id: country !== '' ? parseInt(country) : '', client_id: client !== '' ? parseInt(client) : '', }
                    promises.push(axiosInstance.post(`/dashboard/chart`, data))
                }
    
            }
           
            Promise.all(promises).then(results => {
                results.map(res => {
                    const chart_list = res.data.response.chart_list
                    const data = CurrencyConvertor(chart_list)
                    // console.log(data)
                    total.push(data[user][0] !== '0.00' ? data[user][0] : '')
                    received.push(data[user][1] !== '0.00' ? data[user][1] : '')
                    remaining.push(data[user][2] !== '0.00' ? data[user][2] : '')
                })
                // console.log(total, received, remaining, 'update barchart')
                this.setState({  total, received, remaining, })
            })
        }
    }

    render() {
        const { total, received, remaining, labels } = this.state
        const BarData = {
            labels: labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Total',
                    backgroundColor: '#9B9D9F',
                    // borderWidth: 2,
                    // fill: false,
                    data: total,
                },
                {
                    type: 'bar',
                    label: 'Received',
                    backgroundColor: '#438EEB',
                    
                    data: received,
                },
                {
                    type: 'bar',
                    label: 'Remaining',
                    backgroundColor: '#FD7F59',
                    data: remaining,
                },
            ]
        };
        const Options = BarOptions()
        const Options2 = BarOptions2()
        return (
            <div>
            {/* <Col style={{position:'relative'}} >
            <Row className='chartCard'>
                <Col >
                    <Bar data={BarData} options={Options} />
                </Col>
            </Row>
            </Col>    */}
             <Col style={{position:'relative'}}>
             <Row className='chartCard'>
                 <Col >
                     <Bar data={BarData} options={Options2} />
                 </Col>
             </Row>
             </Col>  
             </div>
        )
    }
}

export default BarChart2