package c.eip.navigation.loggedIn.shop.offer

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import c.eip.Constants
import c.eip.R
import c.eip.adapter.OfferAdapter
import c.eip.model.Offer
import c.eip.services.AuthAPI
import com.google.android.material.floatingactionbutton.FloatingActionButton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class OfferFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val fragmentView = inflater.inflate(R.layout.fragment_shop_offer, container, false)
        val recyclerView = fragmentView.findViewById(R.id.recyclerView) as RecyclerView
        recyclerView.layoutManager = GridLayoutManager(context, 2)
        val offers = ArrayList<Offer>()
        val adapter = OfferAdapter(offers)

        recyclerView.adapter = adapter
        return fragmentView
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val recyclerView = view.findViewById(R.id.recyclerView) as RecyclerView
        recyclerView.layoutManager = GridLayoutManager(context, 2)
        val token = dataGetter.getToken(context!!)
        val offers = ArrayList<Offer>()
        val call = offerService.getAllOffers(token)
        call.enqueue(object : Callback<ArrayList<Offer>> {
            override fun onResponse(
                call: Call<ArrayList<Offer>>,
                response: Response<ArrayList<Offer>>
            ) {
                if (response.isSuccessful) {
                    response.body()?.forEach { element ->
                        offers.add(element)
                    }
                    val adapter = OfferAdapter(offers)

                    recyclerView.adapter = adapter
                    Log.d("Response list offers", response.body().toString())
                }
            }

            override fun onFailure(call: Call<ArrayList<Offer>>, t: Throwable) {
                Log.e("Get all offers erreur", t.message)
            }
        })
        view.findViewById<FloatingActionButton>(R.id.insertOffer)?.setOnClickListener {
            findNavController().navigate(R.id.insertOffer, null)
        }
    }

    companion object {
        val dataGetter = AuthAPI.DataGetter()
        var offerService = Constants.offerServiceTest
    }
}
