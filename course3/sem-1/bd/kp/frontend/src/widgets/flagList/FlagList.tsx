import AddFlagCard from "@/features/addFlagCard";
import Flag from "@/features/flag";
import { appearTransition } from "@/shared/lib/utils";
import { Flag as TFlag } from "@/shared/types/model/flag";
import { Glow, GlowCapture } from "@codaworks/react-glow";
import { animated, useTransition } from "@react-spring/web";

export type FlagListProps = {
  flags: TFlag[];
};

export const FlagList = ({flags}: FlagListProps) => {
  const transitions = useTransition(flags, appearTransition(50));
  // console.log(flags, "FLAGS")

  return (
    <div className="grid w-full gap-2 md:grid-cols-1 lg:grid-cols-[repeat(auto-fit,29vmin)]">
      {flags.length > 0 && transitions((values, item, _, i) => {
        console.log("HERE")
        return (
          <>
            {i === 0 && (
              <animated.div key="add-flag-card" style={{...values}}>
                <GlowCapture className="[&>*]:h-full w-full h-full">
                  <Glow className="w-full h-full">
                    <AddFlagCard />
                  </Glow>
                </GlowCapture>
              </animated.div>
            )}
            <animated.div key={item.id} style={{...values}}>
              <GlowCapture className="[&>*]:h-full w-full h-full">
                <Glow className="w-full h-full">
                  <Flag item={item} />
                </Glow>
              </GlowCapture>
            </animated.div>
          </>
        )
      })}
      {flags.length <= 0 && (
        <GlowCapture className="[&>*]:h-full w-full h-full">
          <Glow className="w-full h-full">
            <AddFlagCard />
          </Glow>
        </GlowCapture>
      )}
    </div>
  )
}