package c.eip.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import c.eip.R
import c.eip.model.Offer

class OfferAdapter(val offersList: ArrayList<Offer>) :
    RecyclerView.Adapter<OfferAdapter.OfferHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OfferHolder {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.offer_cards, parent, false)
        return OfferHolder(v)
    }

    override fun getItemCount(): Int {
        return offersList.size
    }

    override fun onBindViewHolder(holder: OfferHolder, position: Int) {
        holder.bindItems(offersList[position])
    }

    class OfferHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        fun bindItems(offer: Offer) {
            itemView.findViewById<TextView>(R.id.productImg)?.text = offer.productImg
            itemView.findViewById<TextView>(R.id.productDesc)?.text = offer.productDesc
            itemView.findViewById<TextView>(R.id.productName)?.text = offer.productName
            itemView.findViewById<TextView>(R.id.productSex)?.text = offer.productSex
            itemView.findViewById<TextView>(R.id.productSubject)?.text = offer.productSubject
        }

    }
}